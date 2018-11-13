<template>
  <div class="panel">
    <header class="panel-heading">成交订单管理</header>
    <section style="padding-bottom: 30px; margin-top: 10px;">
      <ul class="typeList clearFix">
        <li class="fl" :class="{typeActive:ceId == 0}" @click="changeCurrency(0)">全部</li>
        <li class="fl" v-for="(item,index) in typeList" @click="changeCurrency(item.CurrencyID)"
            :class="{typeActive:item.CurrencyID == ceId}" :key="index">{{item.MarketTypeName }}
        </li>
      </ul>
      <div class="block">
        <span class="demonstration">开始时间：</span>
        <el-date-picker v-model="startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>
        <span class="demonstration">结束时间：</span>
        <el-date-picker v-model="endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>

        <label>订单编号：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="ruleForm.OrderId"></el-input>

        <label>委托编号：</label>
        <el-input style="width:160px;" type="number" placeholder="请输入内容" v-model="ruleForm.entrustNumber"></el-input>
      </div>
      <div class="block">
        <label>用户编号：</label>
        <el-input style="width:160px;" type="number" placeholder="请输入内容" v-model="ruleForm.userNumber"></el-input>
        <label>用户姓名：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="ruleForm.userName"></el-input>
        <label>手机号码：</label>
        <el-input style="width:160px;" type="number" placeholder="请输入内容" v-model="ruleForm.mobileNumber"></el-input>
        <label>Email：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="ruleForm.EmailNumber"></el-input>
        <label>货币市场：</label>
        <el-select style="width:160px;" v-model="ruleForm.monetaryMarket" placeholder="全部">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item,index) in CurrencyExchangeListComputed"
            :key="index"
            :label="item.CurrencyName+'/'+item.ExchangeCurrencyName"
            :value="item.CEID">
          </el-option>
        </el-select>
        <!--:disabled="timeDiff"-->
        <el-button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</el-button>
        <el-button type="success" @click="handleReset">刷新</el-button>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            prop="ID"
            label="订单编号"
            width="80">
          </el-table-column>

          <!-- <el-table-column
            prop="BuyUserID"
            label="买单用户编号"
            width="110">
          </el-table-column> -->

          <el-table-column
            prop="BuyUserFullName"
            label="买单用户姓名"
            width="110">
          </el-table-column>

          <el-table-column
            prop="BuyUserPhoneNumber"
            label="买单用户手机号码"
            width="140">
          </el-table-column>

          <!-- <el-table-column
            prop="SellUserID"
            label="卖单用户编号"
            width="110">
          </el-table-column> -->

          <el-table-column
            prop="SellUserFullName"
            label="卖单用户姓名"
            width="110">
          </el-table-column>

          <el-table-column
            prop="SellUserPhoneNumber"
            label="卖单用户手机号码"
            width="140">
          </el-table-column>

          <el-table-column
            label="货币交易类型"
            width="110">
            <template slot-scope="scope">
              <span>{{scope.row.Unit}}</span>/
              <span>{{scope.row.ExchangeUnit}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="BuyEntrustID"
            label="买单委托编号"
            width="120">
          </el-table-column>

          <el-table-column
            prop="SellEntrustID"
            label="卖单委托编号"
            width="120">
          </el-table-column>

          <el-table-column
            label="成交价格"
            width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.IsBuyPrimary == 1"
                    style="color: #39B6AE">{{parseFloat(scope.row.TradePrice)}}({{scope.row.ExchangeUnit}})</span>
              <span v-else
                    style="color: #EF6F66">{{parseFloat(scope.row.TradePrice)}}({{scope.row.ExchangeUnit}})</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="EntrustVolume"
            label="成交量"
            width="190">
            <template slot-scope="scope">
             <span v-if="scope.row.IsBuyPrimary == 1"
                   style="color: #39B6AE">{{parseFloat(scope.row.TradeVolume)}}({{scope.row.Unit}})</span>
              <span v-else style="color: #EF6F66">{{parseFloat(scope.row.TradeVolume)}}({{scope.row.Unit}})</span>
            </template>
          </el-table-column>
          <el-table-column
            label="成交额"
            width="190">
            <template slot-scope="scope">
             <span v-if="scope.row.IsBuyPrimary == 1" style="color: #39B6AE">
               <span
                 v-text="parseFloat((scope.row.TradeVolume*scope.row.TradePrice).toFixed(8))"></span><span>({{scope.row.ExchangeUnit}})</span>
               </span>
              <span v-else style="color: #EF6F66">
                 <span
                   v-text="parseFloat((scope.row.TradeVolume*scope.row.TradePrice).toFixed(8))"></span><span>({{scope.row.ExchangeUnit}})</span>
              </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="CreateTime"
            label="成交时间"
            width="180">
          </el-table-column>

          <el-table-column
            label="买单手续费"
            width="140">
            <template slot-scope="scope">
              <span>{{scope.row.BuyTradeFees}}({{scope.row.Unit}})</span>
            </template>
          </el-table-column>

          <el-table-column
            label="卖单手续费"
            width="140">
            <template slot-scope="scope">
              <span>{{scope.row.SellTradeFees}}({{scope.row.ExchangeUnit}})</span>
            </template>
          </el-table-column>

          

          
        </el-table>
      </div>
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
    </section>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  export default {
    data(){
      return {
        typeList: [],
        CurrencyExchangeList: [],
        ceId: 0,
        tableData: [],
        loading: true,
        multipleSelection: [],
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
        CurrencyID: '',
        startDate: '',
        endDate: '',
        ruleForm: {
          OrderId: '',   //订单编号
          entrustNumber: '',   //委托编号
          userNumber: '',      //用户编号
          userName: '',     //用户姓名
          mobileNumber: '',     //手机号码
          EmailNumber: '',     //邮箱号码
          monetaryMarket: '',     //货币市场
        },
      }
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getMarketTypeList();
      this.getCurrencyExchange();
      this.getOrder();  //委托订单表格数据
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    methods: {
      getOrder(){   //获取订单数据
        try {
          if (this.startDate > this.endDate) {
            this.$message({
              type: "error",
              message: "开始时间不能大于结束时间!",
            });
            return false;
          }
          let config = {
            method: "POST",
            url: baseUrl + "EntrustOrder/Order",
            data: {
              OrderId: this.ruleForm.OrderId,
              EntrustId: this.ruleForm.entrustNumber,
              CEID: this.ruleForm.monetaryMarket,
              ExchangeCurrencyId: this.CurrencyID,
              Sort: "",
              BeginTime: this.startDate,
              EndTime: this.endDate,
              UserID: this.ruleForm.userNumber,
              FullName: this.ruleForm.userName,
              PhoneNumber: this.ruleForm.mobileNumber,
              Email: this.ruleForm.EmailNumber,
              PageIndex: this.PageIndex,
              PageSize: this.PageSize
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataList = res.data.Data;
              this.totalCount = dataList.TotalCount;
              this.tableData = dataList.DataList;
              this.loading=false;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getMarketTypeList(){   //获取币种单位数据
        try {
          let config = {
            method: "GET",
            url: baseUrl + "MarketType/MarketTypeList?pageindex=1&pagesize=100",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let DataList = res.data.Data.DataList;
              this.typeList = DataList
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getCurrencyExchange(){   //获取货币市场数据
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/QueryCurrencyExchange?pageindex=1&pagesize=100",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.CurrencyExchangeList = res.data.Data.DataList;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      changeCurrency: function (ID) {
        this.ceId = ID;
        if (ID == 0) {
          this.CurrencyID = '';
        } else {
          this.CurrencyID = ID;
        }
        this.tableData = '';
        this.loading=true;
        this.getOrder();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearch(){   //搜索
        this.PageIndex = 1;
        this.getOrder();
      },
      handleReset(){   //刷新
        this.startDate = '';
        this.endDate = '';
        this.ruleForm.OrderId = '';
        this.ruleForm.entrustNumber = '';
        this.ruleForm.userNumber = '';
        this.ruleForm.userName = '';
        this.ruleForm.mobileNumber = '';
        this.ruleForm.EmailNumber = '';
        this.ruleForm.monetaryMarket = '';
        this.getOrder();
      },
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getOrder();
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getOrder();
      },
    },
    computed: {
      timeDiff: function () {
        if (this.ruleForm.entrustNumber != '' || this.ruleForm.userNumber != '' || this.ruleForm.userName != '' || this.ruleForm.mobileNumber != '' || this.ruleForm.EmailNumber != '' || this.ruleForm.monetaryMarket != '') {
          return false;
        }
        if (this.startDate == "" || this.endDate == "") {
          return true;
        }
        else {
          var e = new Date(this.endDate);
          var s = new Date(this.startDate);
          var result = e - s;
          if (result >= 0) {
            return false;
          }
          else {
            return true
          }
        }
      },
      CurrencyExchangeListComputed(){
        if (this.CurrencyID == '') {
          return this.CurrencyExchangeList
        } else {
          return this.CurrencyExchangeList.filter(item => item.ExchangeCurrencyID == this.CurrencyID)
        }
      }
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  .panel {
    min-height: 680px;
  }

  .typeList {
    padding: 0 20px;
    li {
      margin-right: 10px;
      font-size: 14px;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
    li:hover {
      background-color: rgba(65, 202, 192, .3);
      border: 1px solid rgba(65, 202, 192, .3);
      color: #fff;

    }
    .typeActive {
      background-color: #41cac0;
      border-color: #41cac0;
      color: #fff;
    }
  }

  .tit {
    border-color: #eff2f7;
    font-size: 16px;
    font-weight: 900;
    padding: 20px 20px;
    border-bottom: 1px solid transparent;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }

  .block {
    padding: 0 20px;
    label {
      margin-left: 10px;
    }
    .demonstration {
      margin-left: 10px;
    }
  }

  .el-input {
    margin: 15px 0;

  }

  /deep/ .el-input input[type="number"] {
    padding: 0 0 0 15px;
  }

  .el-button {
    padding: 9px 20px;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }
</style>
