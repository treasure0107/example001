<template>
  <div class="panel">
    <header class="panel-heading">
      OTC订单管理
    </header>
    <div class="conten">
      <div class="block lb" style="padding-bottom: 10px;">
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
            币种 ：<el-select v-model="unit" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="val in coins"
                  :key="val"
                  :label="val"
                  :value="val">
                </el-option>
              </el-select>
                买卖方向 ：<el-select v-model="tradeType" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
      <el-option label="用户买入" value="0"></el-option>
      <el-option label="用户卖出" value="1"></el-option>
             </el-select>
       订单状态 ：<el-select v-model="orderstatus" placeholder="请选择">
      <el-option label="全部" value=""></el-option>
      <el-option label="未支付" value="Applying"></el-option>
      <el-option label="申诉中" value="Complaint"></el-option>
      <el-option label="已经支付" value="Paid"></el-option>
      <el-option label="交易完成" value="Completed"></el-option>
      <el-option label="交易取消" value="Cancel"></el-option>
      <el-option label="交易失败" value="Failure"></el-option>
              </el-select>
          </div>
      <div class="block lb" style="padding: 10px 0;">
        商户ID ：<el-input type="Number" v-model="MerchantId" placeholder="请输入内容"></el-input>
        用户ID ：<el-input type="Number" v-model="OrderUserId" placeholder="请输入内容"></el-input>
        手机号码 ：<el-input type="Number" v-model="PhoneNumber" placeholder="请输入内容"></el-input>
        订单ID ：<el-input type="Number" v-model="orderId" placeholder="请输入内容"></el-input>
        商家买卖单ID ：<el-input type="Number" v-model="Entrustid" placeholder="请输入内容"></el-input>
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
            label="订单ID"
            prop="OrderId"
            align="center"
            width="80">
          </el-table-column>
           <!-- <el-table-column
            prop="OrderNumber"
            label="订单单号"
            align="center">
           </el-table-column>-->
             <el-table-column
            prop="EntrustId"
            label="商家买卖单ID"
            align="center">
          </el-table-column>
           <el-table-column
            label="商户(ID)"
            align="center">
             <template slot-scope="scope" >
              <span>{{scope.row.MerchantNickName}}({{scope.row.MerchantUserId}})</span>
            </template>
          </el-table-column>
           <el-table-column
            label="用户(ID)"
            align="center">
            <template slot-scope="scope" >
              <span>{{scope.row.UserNickName}}({{scope.row.Userid}})</span>
            </template>
          </el-table-column>
            <el-table-column
            prop="UserPhoneNumber"
            label="用户手机号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="TradeTypeName"
            label="交易类型"
            align="center"
            width="80">
          </el-table-column>
           <el-table-column
            label="支付方式"
            align="center">
            <template slot-scope="scope" >
              <span>{{scope.row.PaymentName.join(",")}}</span>
            </template>
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
            label="数量"
            align="center">
             <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Volume)}}</span>
            </template>
          </el-table-column>



          <!--  <el-table-column
            prop="MerchantPhoneNumber"
            label="商户手机号"
            align="center">
          </el-table-column>
         <el-table-column
            prop="MerchantNickName"
            label="商家昵称"
            align="center">
          </el-table-column> -->

          <el-table-column
            prop="CreateTime"
            label="创建时间"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column
            prop="LastUpDateTime"
            label="最后更新时间"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column
            prop="OrderStatusName"
            label="订单状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作"
            align="center"
            width="120">
            <template slot-scope="scope" v-if="scope.row.OrderStatus=='Paid'&&scope.row.Tradetype=='Sell'">
              <el-button type="primary" size="mini" round @click="CompleteBtn(scope.row.OrderId)">完成订单</el-button>
            </template>
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
      orderId: "",
      MerchantId: "",
      CoinUnit: "",
      status: "",
      OrderUserId: "",
      Entrustid: "",
      unit: "",
      coins: [],
      PhoneNumber: "",
      orderstatus: "",
      tradeType: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = true;
    next();
  },
  mounted() {
    this.getMemberList();
    this.getCoinUnit();
    document.onkeydown = e => {
      let _key = window.event.keyCode;
      if (_key === 13) {
        this.handleSearch();
      }
    };
  },
  methods: {
    refresh(){
      this.BeginTime = ''
      this.PageIndex=1
      this.EndTime = ''
      this.Email = ''
      this.PhoneNumber = ''
      this.MerchantId = ''
      this.orderId = ''
      this.Entrustid = ''
      this.unit = ''
      this.orderstatus = ''
      this.tradeType = ''
      this.OrderUserId = ''
      this.getMemberList()
    },
    getMemberList() {
      let self = this;
      this.$axios({
        method: "post",
        url: baseUrl + "C2C/QueryOtcOrder",
        data: {
          PageIndex: self.PageIndex,
          PageSize: self.PageSize,
          BeginTime: self.BeginTime,
          EndTime: self.EndTime,
          MerchantId: self.MerchantId,
          OrderId: self.orderId,
          Entrustid: self.Entrustid,
          CoinUnit: self.unit,
          PhoneNumber: self.PhoneNumber,
          orderstatus: self.orderstatus,
          tradeType: self.tradeType,
          OrderUserId: self.OrderUserId
        }
      }).then(result => {
        if (until.responesValidate(result)) {
          let res = result.data.Data.DataList;
          self.tableData = res;
          self.totalCount = result.data.Data.TotalCount;
        }
      });
    },
    CompleteBtn(id) {
      this.$confirm("是否确认完成订单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.CompleteOrder(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    CompleteOrder(id) {
      try {
        let config = {
          method: "GET",
          url: baseUrl + "C2C/CommpleteOrder?orderId=" + id
        };
        this.$axios(config).then(res => {
          this.$message({
            type: "success",
            duration: 1000,
            message: "确认成功!",
            onClose: () => {
              this.getMemberList();
            }
          });
        });
      } catch (ex) {
        until.consoleLog(ex);
      }
    },
    Cancel() {
      try {
        let config = {
          method: "GET",
          url: baseUrl + "C2C/UpdateExpirationApplyingOrder"
        };
        this.$axios(config).then(res => {
          this.$message({
            type: "success",
            duration: 1000,
            message: "取消成功!",
            onClose: () => {
              this.getMemberList();
            }
          });
        });
      } catch (ex) {
        until.consoleLog(ex);
      }
    },
    getCoinUnit() {
      this.$axios({
        methods: "get",
        url: baseUrl + "Currency/QueryCurrencyIdAndUnit?isOtc=" + true
      }).then(data => {
        this.coins = data.data.Data;
      });
    },
    handleSizeChange(val) {
      this.PageSize = parseInt(`${val}`);
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
