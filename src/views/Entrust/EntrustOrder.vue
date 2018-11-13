<template>
  <div class="panel">
    <header class="panel-heading">
      委托no管理
    </header>
    <section style="padding-bottom: 30px; margin-top: 10px;">
      <ul class="typeList clearFix">
        <li class="fl" :class="{typeActive:ceId == 0}" @click="changeCurrency(0)">全部</li>
        <li class="fl" v-for="(item,index) in typeList" :key="index" @click="changeCurrency(item.CurrencyID)"
            :class="{typeActive:item.CurrencyID == ceId}">{{item.MarketTypeName }}
        </li>
      </ul>
      <div class="block">
        <span class="demonstration">开始时间：</span>

        <el-date-picker v-model="startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>
        <span class="demonstration">结束时间：</span>
        <el-date-picker v-model="endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>
        <label>委托编号：</label>
        <el-input style="width:160px;" placeholder="请输入内容" type="number" v-model="ruleForm.entrustNumber"></el-input>
        <label>委托类型：</label>
        <el-select style="width:100px;" v-model="ruleForm.entrustType" placeholder="全部">
          <el-option label="全部" value=""></el-option>
          <el-option label="买单" value="1"></el-option>
          <el-option label="卖单" value="0"></el-option>
        </el-select>
        <label>委托状态：</label>
        <el-select style="width:160px;" v-model="ruleForm.entrustStatus" placeholder="全部">
          <el-option label="全部" value=""></el-option>
          <el-option label="待成交" value="0"></el-option>
          <el-option label="已取消" value="1"></el-option>
          <el-option label="已完成" value="2"></el-option>
          <el-option label="部分完成" value="3"></el-option>
          <el-option label="已完成+未完成" value="023"></el-option>
        </el-select>
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
            v-for="item in CurrencyExchangeListComputed"
            :key="item.CEID"
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
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <!-- <el-table-column
            prop="ID"
            label="委托编号"
            width="100">
          </el-table-column>
          <el-table-column

            width="80">
          </el-table-column> -->
          <!-- <el-table-column
            prop="SerialNumber"
            label="流水号"
            width="180">
          </el-table-column> -->
          <el-table-column
            prop="FullName"
            label="用户姓名"
            width="90">
          </el-table-column>
          <el-table-column
            prop="PhoneNumber"
            label="用户手机号码"
            width="130">
          </el-table-column>
          <el-table-column
            label="货币交易类型"
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.Unit}}</span>/
              <span>{{scope.row.ExchangeUnit}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="委托类型"
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.IsBuy == 1" style="color: #39B6AE">买单</span>
              <span v-if="scope.row.IsBuy == 0" style="color: #EF6F66">卖单</span>
            </template>
          </el-table-column>
          <!--sortable-->
          <el-table-column
            label="委托价格"
            width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.IsBuy == 1"
                    style="color: #39B6AE">{{parseFloat(scope.row.EntrustPrice)}}({{scope.row.ExchangeUnit}})</span>
              <span v-if="scope.row.IsBuy == 0"
                    style="color: #EF6F66">{{parseFloat(scope.row.EntrustPrice)}}({{scope.row.ExchangeUnit}})</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="EntrustVolume"
            label="委托数量"
            width="190">
            <template slot-scope="scope">
              <span v-if="scope.row.IsBuy == 1"
                    style="color: #39B6AE">{{parseFloat(scope.row.EntrustVolume)}}({{scope.row.Unit}})</span>
              <span v-if="scope.row.IsBuy == 0"
                    style="color: #EF6F66">{{parseFloat(scope.row.EntrustVolume)}}({{scope.row.Unit}})</span>
            </template>
          </el-table-column>
          <el-table-column
            label="成交总额"
            width="160">
            <template slot-scope="scope">
              <span>{{scope.row.CompletedTotalAmount}}</span>
              <span>({{scope.row.ExchangeUnit}})</span>
            </template>
          </el-table-column>
          <el-table-column
            label="已成交数量"
            width="190">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.CompletedVolume)}}</span>
              <span>({{scope.row.Unit}})</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="未成交数量"
            width="190">
            <template slot-scope="scope">
              <span>{{scope.row.NoCompletedVolume}}</span>
              <span>({{scope.row.Unit}})</span>
            </template>
          </el-table-column> -->
          <el-table-column
            label="成交平均价"
            width="140">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.AveragePrice)}}</span>
              <span>({{scope.row.ExchangeUnit}})</span>
            </template>
          </el-table-column>

          <el-table-column
            label="交易手续费"
            width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.IsBuy == 1"
                    style="color: #39B6AE">{{parseFloat(scope.row.TradeFees)}}({{scope.row.Unit}})</span>
              <span v-if="scope.row.IsBuy == 0"
                    style="color: #EF6F66">{{parseFloat(scope.row.TradeFees)}}({{scope.row.ExchangeUnit}})</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="EntrustStatus"
            label="委托状态"
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.EntrustStatus == 0" style="color: #EF6F66">{{scope.row.EntrustStatusName}}</span>
              <span v-if="scope.row.EntrustStatus == 1" style="color: #39B6AE">{{scope.row.EntrustStatusName}}</span>
              <span v-if="scope.row.EntrustStatus == 2" style="color: #6dbb4a">{{scope.row.EntrustStatusName}}</span>
              <span v-if="scope.row.EntrustStatus == 3" style="color: #6dbb4a">{{scope.row.EntrustStatusName}}</span>
            </template>
          </el-table-column>


          <el-table-column
            prop="CreateTime"
            label="委托时间"
            width="160">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope" v-if="scope.row.EntrustStatus==0 || scope.row.EntrustStatus==3">
              <el-button type="danger" v-if="isPath==2" size="mini" @click="cancelBtn(scope.row.ID,scope.row.UserID)">
                取消
              </el-button>
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
  import {MessageBox} from 'element-ui';
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
          entrustNumber: '',   //委托编号
          entrustType: '',   //委托类型
          entrustStatus: '',   //委托状态
          userNumber: '',      //用户编号
          userName: '',     //用户姓名
          mobileNumber: '',     //手机号码
          EmailNumber: '',     //手机号码
          monetaryMarket: '',     //货币市场
        },
        isPath: ''
      }
    },
    created(){
      let path = this.$route.path.slice(1, this.$route.path.length);
      this.isPath = until.getPath(path) & 2;
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getEntrustOrder();  //委托订单表格数据
      this.getMarketTypeList();
      this.getCurrencyExchange();
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    methods: {
      cancelBtn(id, userID){
        this.$confirm('是否取消委托？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.CancelEntrust(id, userID);

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      CancelEntrust(id, userID){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "EntrustOrder/CancelEntrust/" + id + '?userid=' + userID,
          };
          this.$axios(config).then(res => {
            this.$message({
              type: 'success',
              duration: 1000,
              message: '取消成功!',
              onClose: () => {
                this.getEntrustOrder();
              }
            });
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getEntrustOrder(){
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
            url: baseUrl + "EntrustOrder/Entrust",
            data: {
              IsBuy: this.ruleForm.entrustType,
              EntrustStatus: this.ruleForm.entrustStatus,
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
      getMarketTypeList(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "MarketType/MarketTypeList?pageindex=1&pagesize=100",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let DataList = res.data.Data.DataList;
              this.typeList = DataList;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getCurrencyExchange(){   //获取货币市场
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
      changeCurrency: function (ID) {   //币种单位
        this.ceId = ID;
        this.ruleForm.monetaryMarket = "";
        if (ID == 0) {
          this.CurrencyID = '';
        } else {
          this.CurrencyID = ID;
        }
        this.tableData = '';
        this.loading=true;
        this.getEntrustOrder();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearch(){
        this.PageIndex = 1;
        this.getEntrustOrder();
      },
      handleReset(){
        this.startDate = '';
        this.endDate = '';
        this.ruleForm.entrustNumber = '';
        this.ruleForm.entrustType = '';
        this.ruleForm.entrustStatus = '';
        this.ruleForm.userNumber = '';
        this.ruleForm.userName = '';
        this.ruleForm.mobileNumber = '';
        this.ruleForm.EmailNumber = '';
        this.ruleForm.monetaryMarket = '';
        this.getEntrustOrder();
      },
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getEntrustOrder();
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getEntrustOrder();
      },
    },
    computed: {
      timeDiff: function () {
        if (this.ruleForm.entrustNumber != '' || this.ruleForm.entrustType != '' || this.ruleForm.entrustStatus != '' || this.ruleForm.userNumber != '' || this.ruleForm.userName != '' || this.ruleForm.mobileNumber != '' || this.ruleForm.EmailNumber != '' || this.ruleForm.monetaryMarket != '') {
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

  .el-button--mini, .el-button--mini.is-round {
    padding: 4px 9px;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }
</style>
