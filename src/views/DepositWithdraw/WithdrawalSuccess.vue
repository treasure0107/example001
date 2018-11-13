<template>
  <div class="panel">
    <header class="panel-heading">货币提现管理</header>
    <section style="padding-bottom: 30px; margin-top: 16px;">
      <ul class="typeList clearFix">
        <li class="fl" :class="{typeActive:ceId == 0}" @click="changeCurrency(0)">全部</li>
        <li class="fl" v-for="(item,index) in CurrencyList" :key="index" @click="changeCurrency(item.ID)"
            :class="{typeActive:item.ID == ceId}">{{item.Name }}
        </li>
      </ul>
      <div class="block" style="margin-top: 10px;">
        <span class="demonstration">开始时间：</span>
        <el-date-picker v-model="startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>
        <span class="demonstration">结束时间：</span>
        <el-date-picker v-model="endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>
        <label>流水号：</label>
        <el-input style="width:230px;" placeholder="请输入内容" v-model="ruleForm.serialNumber"></el-input>
      </div>
      <div class="block" style="margin-top: 16px;">
        <label>用户编号：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="ruleForm.userNumber"></el-input>
        <label>用户姓名：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="ruleForm.userName"></el-input>
        <label>手机号码：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="ruleForm.mobileNumber"></el-input>
        <label>Email：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="ruleForm.EmailNumber"></el-input>
        <el-button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</el-button>
        <el-button type="success" @click="handleReset">刷新</el-button>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="SerialNumber"
            label="流水号"
            width="180">
          </el-table-column>

          <el-table-column
            prop="UserID"
            label="用户编号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="FullName"
            label="姓名"
            width="90">
          </el-table-column>
          <el-table-column
            prop="PhoneNumber"
            label="手机号码"
            width="130">
          </el-table-column>

          <el-table-column
            prop="Email"
            label="Email"
            width="190">
          </el-table-column>

          <el-table-column
            prop="CurrencyName"
            label="货币名称"
            width="110">
          </el-table-column>
          <el-table-column
            prop="TransID"
            label="交易ID"
            width="300">
          </el-table-column>
          <el-table-column
            prop="BlockAddr"
            label="提现钱包地址"
            width="300">
          </el-table-column>
          <el-table-column 
            label="提现金额"
            width="200">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.SubmitAmount)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="手续费"
            width="200">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Fees)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="实际金额"
            width="100">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.TradeAmount)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="用户余额"
            width="160">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.BalanceAmount)}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="ConfirmCount"
            label="确认次数"
            width="160">
          </el-table-column>
          <el-table-column
            prop="ConfirmedTime"
            label="确认时间"
            width="160">
          </el-table-column>

          <el-table-column
            label="确认状态"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.ConfirmedStatus == 0"
                    style="color: #6dbb4a">{{scope.row.ConfirmedStatusName}}</span>
              <span v-else-if="scope.row.ConfirmedStatus == 1"
                    style="color: #39B6AE">{{scope.row.ConfirmedStatusName}}</span>
              <span v-else-if="scope.row.ConfirmedStatus == -1"
                    style="color: #EF6F66">{{scope.row.ConfirmedStatusName}}</span>
              <span v-else style="color: #EF6F66">{{scope.row.ConfirmedStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="AuditUserFullName"
            label="审核人"
            width="130">
          </el-table-column>
          <el-table-column
            prop="AuditTime"
            label="审核时间"
            width="160">
          </el-table-column>
          <el-table-column
            prop="Comments"
            label="备注"
            width="160">
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            label="创建时间"
            width="160">
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
        tableData: [],
        multipleSelection: [],
        CurrencyList: [],
        ceId: 0,
        CurrencyID: '',
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
        startDate: '',
        endDate: '',
        ruleForm: {
          serialNumber: '',   //流水号
          userNumber: '',      //用户编号
          userName: '',     //用户姓名
          mobileNumber: '',     //手机号码
          EmailNumber: '',     //手机号码
        },
      }
    },
    mounted(){
      this.getList();
      this.getOrder();
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    methods: {
      getList(){   //获取币种数据
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/QueryCurrencyPageForList?pageindex=1&pagesize=100",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.CurrencyList = res.data.Data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getOrder(){   //获取货币体现成功记录
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
            url: baseUrl + "DepositWithdraw/QueryWithdraw",
            data: {
              ConfirmedStatus: 1,
              CurrencyID: this.CurrencyID,
              SerialNumber: this.ruleForm.serialNumber,
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
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      changeCurrency (ID) {
        this.ceId = ID;
        if (ID == 0) {
          this.CurrencyID = '';
        } else {
          this.CurrencyID = ID;
        }
        this.getOrder();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearch(){
        this.PageIndex = 1;
        this.getOrder();
      },
      handleReset(){   //刷新
        this.startDate = '';
        this.endDate = '';
        this.ruleForm.serialNumber = '';
        this.ruleForm.userNumber = '';
        this.ruleForm.userName = '';
        this.ruleForm.mobileNumber = '';
        this.ruleForm.EmailNumber = '';
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
        if (this.ruleForm.serialNumber != '' || this.ruleForm.userNumber != '' || this.ruleForm.userName != '' || this.ruleForm.mobileNumber != '' || this.ruleForm.EmailNumber != '') {
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
      margin-bottom: 10px;
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

  .el-button {
    padding: 9px 20px;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }
</style>
