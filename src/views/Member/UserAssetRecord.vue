<template>
  <div class="panel">
    <header class="panel-heading">
      用户资产变更记录
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
        资产类型：<el-select v-model="IsOtc" placeholder="请选择" @change="typeChange">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </div>
      <div class="block lb" style="padding: 10px 0;">
        记录ID ：<el-input type="Number" v-model="Id" placeholder="请输入内容"></el-input>
        用户ID ：<el-input type="Number" v-model="UserId" placeholder="请输入内容"></el-input>
        币种 ：<el-select v-model="coinUnit" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="val in coins"
                  :key="val"
                  :label="val"
                  :value="val">
                </el-option>
              </el-select>
        流水号 ：<el-input type="Number" v-model="SerialNumber" placeholder="请输入内容"></el-input>

        <el-button type="danger" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="refresh">刷新</el-button>
      </div>
      <div style="margin-top: 10px;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="记录ID"
            prop="ID"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="SerialNumber"
            label="流水号"
            align="center"
            width='180'>
          </el-table-column>
          <el-table-column
            prop="UserID"
            label="用户ID"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="CurrencyUnit"
            label="币种"
            align="center">
          </el-table-column>
          <el-table-column 
            label="数量"
            align="center">
             <template slot-scope="scope">
              <span>{{parseFloat(scope.row.ChangeValue)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="用户余额"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.AssetBalance)}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="RecordTypeName"
            label="记录类型名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            label="创建时间"
            align="center"
            width="160">
          </el-table-column>
        </el-table>
        <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;"
             v-if="tableData && tableData.length">
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
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import {baseUrl} from "@/config/env";
  import until from "@/scripts/until";
  export default {
    data(){
      return {
        tableData: [],
        PageIndex: 1,
        PageSize: 10,
        totalCount: 1,
        BeginTime: '',
        EndTime: '',
        UserId: '',
        CurrencyUnit:"",
        IsOtc:false,
        options:[
            {
                label:'币币',
                value:false
            },
            {
                label:'法币',
                value:true
            }
        ],
        coinUnit:'',
        coins:[],
        SerialNumber:'',
        Id:''
      }

    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getMemberList();
      this.getCoinUnit();
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    methods: {
      typeChange(){
        this.getCoinUnit()
        this.coinUnit = ''
      },
      refresh(){
        this.BeginTime = ''
        this.EndTime = ''
        this.IsOtc = false
        this.SerialNumber = ''
        this.PageIndex=1
        this.CurrencyUnit = ''
        this.UserId = ''
        this.Id = ''
        this.getMemberList()
      },
      getCoinUnit() {
        this.$axios({
          methods: "get",
          url: baseUrl + "Currency/QueryCurrencyIdAndUnit?isOtc=" + this.IsOtc
        }).then(data => {
          this.coins = data.data.Data;
        });
      },
      getMemberList() {
        let self = this;
        if (self.BeginTime > self.EndTime) {
          this.$message({
            type: "error",
            message: "开始时间不能大于结束时间!",
          });
          return false;
        }
        this.$axios({
          method: "post",
          url: baseUrl + 'User/QueryUserAssetRecord',
          data: {
            'PageIndex': self.PageIndex,
            'PageSize': self.PageSize,
            'BeginTime': self.BeginTime,
            'EndTime': self.EndTime,
            'IsOtc' : self.IsOtc,
            "SerialNumber":self.SerialNumber,
            "CurrencyUnit": self.coinUnit,
            "Id":self.Id,
            "UserId":self.UserId
          }
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result.data.Data.DataList;
            self.tableData = res;
            self.totalCount = result.data.Data.TotalCount;
          }
        });
      },
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getMemberList();
      },
      handleCurrentChange(val){
          this.PageIndex = val;
          this.getMemberList();
      },
      handleSearch(){
        this.PageIndex = 1;
        this.getMemberList();
      }
    },
    components: {}
  }

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
    width: 250px!important;
  }
</style>
