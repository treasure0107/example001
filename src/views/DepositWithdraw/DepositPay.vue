<template>
  <div class="panel">
    <header class="panel-heading">货币充值管理</header>
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
      <div style="padding: 20px;">
        <el-button type="success" @click="handEnter" v-if="isPath==1">手动录入</el-button>
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
            prop="BlockAddr"
            label="充值钱包地址"
            width="360">

          </el-table-column>
          <el-table-column
            label="充值金额"
            width="200">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.TradeAmount)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="用户余额"
            width="200">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.BalanceAmount)}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="ConfirmCount"
            label="确认次数"
            width="100">
            
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
            prop="Comments"
            label="备注"
            width="160">
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            label="创建时间"
            width="160">
          </el-table-column>
          <el-table-column
            prop="EntrustStatus"
            label="状态"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.RecordStatus == 0" style="color: #EF6F66">禁用</span>
              <span v-else-if="scope.row.RecordStatus == 1" style="color: #39B6AE">正常</span>
              <span v-else style="color: #6dbb4a">已删除</span>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div>
        <el-dialog title="录入充值信息" width="580px" :visible.sync="dialogVisible" :before-close="clearContent">
          <el-form :model="form" label-width="100px" label-position="left">
            <el-form-item label="币种">
              <el-select v-model="form.CurrencyID" placeholder="请选择币种" style="width: 100%;">
                <el-option
                  v-for="item in currencySelectList"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Txid">
              <el-input v-model="form.TxId" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.PhoneNumber" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model="form.Email" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-form>
          <p class="dialog-line"></p>
          <el-form :model="getForm" label-width="100px" label-position="left">
            <el-form-item label="地址">
              <el-input :disabled="true" v-model="getForm.DepositAddress"></el-input>
            </el-form-item>
            <el-form-item label="金额">
              <el-input :disabled="true" v-model="getForm.Amount"></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <el-input :disabled="true" v-model="getForm.BizCreateTime"></el-input>
            </el-form-item>
          </el-form>
          <footer slot="footer" class="dialog-footer">
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button type="danger" @click="submitBtn" :disabled="isSearch">提交</el-button>
          </footer>
        </el-dialog>
      </div>
      <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;"
           v-if="tableData && tableData.length">
        <el-pagination
          prevText="<"
          nextText=">"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          :page-sizes="pageSizesList"
          :page-size="PageSize"
          :current-page.sync="PageIndex"
          background
        >
        </el-pagination>
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
        currencySelectList: [],
        ceId: 0,
        CurrencyID: '',
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
        pageSizesList: [10, 15, 20, 30, 50],
        startDate: '',
        endDate: '',
        ruleForm: {
          serialNumber: '',   //流水号
          userNumber: '',      //用户编号
          userName: '',     //用户姓名
          mobileNumber: '',     //手机号码
          EmailNumber: '',     //手机号码
        },
        form: {
          CurrencyID: '',
          TxId: "",
          PhoneNumber: "",
          Email: ""
        },
        getForm: {
          DepositAddress: '',
          Amount: '',
          CreateTime: '',
          TxId: '',
          CurrencyId: '',
          UserId: '',
          BizCreateTime: ""
        },
        dialogVisible: false,
        isSearch: true,
        isPath:''
      }
    },
    created(){
      let path = this.$route.path.slice(1, this.$route.path.length);
      this.isPath = until.getPath(path)&1;
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getList();
      this.getOrder();
      this.getQueryCurrencyPage();
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
      getList(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/QueryCurrencyPageForList",
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
      getOrder(){   //获取货币充值记录
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
            url: baseUrl + "DepositWithdraw/Deposit",
            data: {
              ConfirmedStatus: '',
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
      changeCurrency: function (ID) {
        this.ceId = ID;
        if (ID == 0) {
          this.CurrencyID = '';
        } else {
          this.CurrencyID = ID;
        }
        this.PageIndex = 1 ;
        this.getOrder();
      },
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        console.log('pageSize: '+this.pageSize);
        this.getOrder();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearch(){
        this.PageIndex = 1;
        this.getOrder();
      },
      handleReset(){
        this.startDate = '';
        this.endDate = '';
        this.ruleForm.serialNumber = '';
        this.ruleForm.userNumber = '';
        this.ruleForm.userName = '';
        this.ruleForm.mobileNumber = '';
        this.ruleForm.EmailNumber = '';
        this.getOrder();
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getOrder();
      },
      handEnter(){
        this.dialogVisible = true;
      },
      searchBtn(){   //搜索
        if (!this.form.CurrencyID) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "请选择币种！",
          });
          return false;
        }
        if (!this.form.TxId) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "TxId不能为空！",
          });
          return false;
        }
        if (!this.form.PhoneNumber && !this.form.Email) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "手机号码和邮箱请至少写一个！",
          });
          return false;
        }
        if (this.form.PhoneNumber) {
          let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if (!reg.test(this.form.PhoneNumber)) {
            this.$message({
              type: "error",
              duration: 1000,
              message: "请输入正确手机号码！",
            });
            return false;
          }
        }
        if (this.form.Email) {
          let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
          if (!reg.test(this.form.Email)) {
            this.$message({
              type: "error",
              duration: 1000,
              message: "请输入正确邮箱！",
            });
            return false;
          }
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "DepositWithdraw/GetDepositInfo",
            data: this.form
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.getForm = res.data.Data;
              if (res.data.Status) {
                this.isSearch = false;
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: res.data.msg || "查询成功！"
                });
              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitBtn(){   //手动录入信息提交
        try {
          let config = {
            method: "POST",
            url: baseUrl + "DepositWithdraw/SaveDepositInfo",
            data: this.getForm
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(result)) {
              if (res.data.Status) {
                this.$message ({
                  type: "success",
                  duration: 1000,
                  message: res.data.Msg || "提交成功！",
                  onClose: () => {
                    this.clearContent ();
                    this.isSearch = true;
                  }
                });
              } else {
                this.$message ({
                  type: "error",
                  duration: 1000,
                  message: res.data.Msg || "提交失败！",
                  onClose: () => {
                    this.clearContent ();
                    this.isSearch = true;
                  }
                });
              }
            }

          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      clearContent(){
        this.dialogVisible = false;
        this.form = {};
        this.getForm = {};
      },
      getQueryCurrencyPage(){   //获取货币列表
        try {
          let config = {
            method: "GET",
            url: baseUrl + "DepositWithdraw/DepositEditCurrencyList",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.currencySelectList = res.data.Data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      cancelBtn(id){
        this.$confirm('是否取消委托？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.CancelEntrust(id);

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      CancelEntrust(id){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "EntrustOrder/CancelEntrust?id=" + id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(result)) {
              this.$message ({
                type: 'success',
                message: '取消成功!'
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      }
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

  /deep/ .el-dialog {
    border-radius: 6px;
  }

  /deep/ .el-dialog__header {
    background-color: #00A8B3;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .el-dialog__title {
      color: #fff;
    }
  }

  /deep/ .el-form-item {
    margin-bottom: 0;
  }

  /deep/ .el-input[data-v-a10fec9c] {
    margin: 0;
  }

  /deep/ .el-form-item__content {
    margin-bottom: 15px;
  }

  /*  /deep/ .el-form {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }*/
  .dialog-line {
    width: 100%;
    height: 1px;
    background-color: #eee;
    margin: 10px 0 20px;
  }
</style>
