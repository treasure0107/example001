<template>
  <div class="panel">
    <header class="panel-heading">
      OTC买卖单管理
    </header>
    <div class="conten">
      <div class="block lb">
        日期范围:
        从
        <el-date-picker
          v-model="BeginTime"
          style="width: 200px;"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
        到
        <el-date-picker
          v-model="EndTime"
          style="width: 200px;"
          type="datetime"
          size="large"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="block lb" style="padding: 10px 0;">
        买卖单ID ：<el-input type="Number" v-model="Entrustid" placeholder="请输入内容"></el-input>
        商家ID ：<el-input type="Number" v-model="MerchantId" placeholder="请输入内容"></el-input>
        手机号码 ：<el-input type="Number" v-model="PhoneNumber" placeholder="请输入内容"></el-input>
        币种 ：<el-select v-model="coinUnit" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="val in coins"
                  :key="val"
                  :label="val"
                  :value="val">
                </el-option>
              </el-select>
        订单状态 ：<el-select v-model="sta" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="已下架" value="Canceled"></el-option>
                <el-option label="已完成" value="Finished"></el-option>
                <el-option label="在售中" value="OnSale"></el-option>
              </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="refresh">刷新</el-button>
      </div>
      <div style="margin-top: 10px;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="买卖单ID"
            prop="EntrustId"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="TradeTypeName"
            label="交易类型"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="CoinUnit"
            label="币种"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column 
            label="单价"
            align="center">
             <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Price)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="发布数量"
            align="center">
              <template slot-scope="scope">
              <span>{{parseFloat(scope.row.TotalVolume)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="可用数量"
            align="center">
             <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Volume)}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            label="支付方式"
            align="center">
            <template slot-scope="scope" >
              <span>{{scope.row.PaymentName.join(",")}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="MerchantId"
            label="商家ID"
            align="center">
          </el-table-column>
          <el-table-column 
            label="单笔最大限额"
            align="center">
              <template slot-scope="scope">
              <span>{{parseFloat(scope.row.MaxTradeAmount)}}</span> 
            </template>
          </el-table-column>
           <el-table-column 
            label="单笔最小限额"
            align="center">
                <template slot-scope="scope">
              <span>{{parseFloat(scope.row.MinTradeAmount)}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            label="创建时间"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column
            prop="StatusName"
            label="订单状态"
            align="center">
          </el-table-column>
        </el-table>
        <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;" v-if="tableData && tableData.length">
          <el-pagination
            prevText="<"
            nextText=">"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            :page-size="PageSize"
            :current-page.sync="PageIndex"
            background
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import { baseUrl } from "@/config/env";
import until from "@/scripts/until";
export default {
  data() {
    return {
      tableData: [],
      PageIndex: 1,
      PageSize: 10,
      totalCount: 1,
      BeginTime: "",
      EndTime: "",
      Entrustid: "",
      MerchantId: "",
      coinUnit: "",
      Status: "",
      coins:[],
      sta:'',
      PhoneNumber: ''
    };
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = true;
    next();
  },
  mounted() {
    this.getCoinUnit();
    this.getMemberList();
    document.onkeydown=e=>{
      let _key=window.event.keyCode;
      if(_key===13){
        this.handleSearch();
      }
    }
  },
  methods: {
    refresh(){
      this.BeginTime = ''
      this.PageIndex=1
      this.EndTime = ''
      this.PhoneNumber = ''
      this.MerchantId = ''
      this.Entrustid = ''
      this.sta = ''
      this.coinUnit = ''
      this.getMemberList()
    },
    getMemberList() {
      let self = this;
      this.$axios({
        method: "post",
        url: baseUrl + "C2C/QueryOtcentrust",
        data: {
          PageIndex: self.PageIndex,
          PageSize: self.PageSize,
          BeginTime: self.BeginTime,
          EndTime: self.EndTime,
          MerchantId: self.MerchantId,
          Entrustid: self.Entrustid,
          CoinUnit: self.coinUnit,
          Status: self.sta,
          PhoneNumber: self.PhoneNumber
        }
      }).then(result => {
        if (until.responesValidate(result)) {
          let res = result.data.Data.DataList;
          self.tableData = res;
          self.totalCount = result.data.Data.TotalCount;
        }
      });
    },
    getCoinUnit() {
      this.$axios({
        methods: "get",
        url: baseUrl + "Currency/QueryCurrencyIdAndUnit?isOtc=" + true
      }).then(data => {
        this.coins = data.data.Data;
      });
    },
    handleSizeChange(val){
      this.PageSize= parseInt(`${val}`);
      this.getMemberList();
    },
    handleCurrentChange(val) {
      this.PageIndex = val;
      this.getMemberList();
    },
    handleSearch() {
      this.PageIndex = 1;
      this.getMemberList();
    }
  },
  components: {}
};
</script>

<style lang="" scoped>
h4 {
  text-align: left;
  font-size: 20px;
  padding: 20px 20px;
  border-bottom: 1px solid #f1f1f1;
}
.lb {
  text-align: left;
  height: 25px;
  line-height: 25px;
  margin-bottom: 15px;
}
.conten {
  padding: 20px 20px;
}
.el-input {
  width: 150px;
  margin-right: 10px;
}
el-date-picker {
  width: 250px !important;
}
</style>
