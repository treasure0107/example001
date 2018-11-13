<template>
  <div class="panel">
    <header class="panel-heading">
      法币银行卡信息管理
    </header>
    <section style="padding-bottom: 30px; margin-top: 10px;">

      <div class="block">
        <label>用户ID：</label>
        <el-input style="width:160px;" placeholder="请输入内容" type="number" v-model="ruleForm.UserId"></el-input>
        <label>用户名：</label>
        <el-input style="width:160px;" placeholder="请输入内容" type="text" v-model="ruleForm.UserName"></el-input>
        <label>用户邮箱：</label>
        <el-input style="width:160px;" placeholder="请输入内容" type="text" v-model="ruleForm.Email"></el-input>
           <label>用户手机号：</label>
        <el-input style="width:160px;" placeholder="请输入内容" type="text" v-model="ruleForm.PhoneNumber"></el-input>
        <label>银行卡号：</label>
        <el-input style="width:160px;" placeholder="请输入内容" type="text" v-model="ruleForm.BankCard"></el-input>
        <el-button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</el-button>
        <el-button type="success" @click="handleReset">刷新</el-button>
      </div>

      <div>
           <el-table
          width="100%"
          :data="tableData">
          <el-table-column
            prop="UserId"
            label="用户ID"
            width="100">
          </el-table-column>

          <el-table-column
           prop="UserName"
            label="昵称"
            width="145">
          </el-table-column>
          <el-table-column
            prop="TrueName"
            label="银行卡姓名"
            width="100">
          </el-table-column>
          <el-table-column
           prop="Email"
            label="邮箱"
            width="190">
          </el-table-column>
            <el-table-column
           prop="PhoneNumber"
            label="手机号"
            width="200">
          </el-table-column>
        <el-table-column
           prop="BankName"
            label="银行名称"
            width="150">
          </el-table-column>
        <el-table-column
           prop="BankCard"
            label="银行卡号"
            width="200">
          </el-table-column>
          <el-table-column
           prop="BankAddress"
            label="银行地址"
            width="200">
          </el-table-column>
          <el-table-column
           prop="Remark"
            label="备注信息"
            width="200">
          </el-table-column>

          <el-table-column
            prop="CreateTime"
            label="创建时间"
            width="200">
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
          :page-size="ruleForm.PageSize"
          :current-page.sync="ruleForm.PageIndex"
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
        CoinList:[],
        loading: true,
        multipleSelection: [],
        totalCount: 0,
        ruleForm: {
          PageIndex: 1,
          PageSize: 10,
          UserId: '',   //用户id
          UserName: '',     //用户姓名
          PhoneNumber: '',     //手机号码
          Email: '',     //邮箱
          BankCard: '',     //银行卡号
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
      this.GetOTCPaymentBankPageList();  //获取表格数据
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    methods: {
        GetOTCPaymentBankPageList(){
        try {
          let config = {
            method: "POST",
            url: baseUrl + "C2C/GetBankPageList",
            data: this.ruleForm
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

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSearch(){
        this.PageIndex = 1;
        this.GetOTCPaymentBankPageList();
      },
      handleReset(){
        this.ruleForm.UserId = '';
        this.ruleForm.UserName = '';
        this.ruleForm.PhoneNumber = '';
        this.ruleForm.Email = '';
        this.ruleForm.BankCard = '';
        this.GetOTCPaymentBankPageList();
      },
      handleSizeChange(val){
        this.ruleForm.PageSize= parseInt(`${val}`);
        this.GetOTCPaymentBankPageList();
      },
      handleCurrentChange(val){
        this.ruleForm.PageIndex = val;
        this.GetOTCPaymentBankPageList();
      },
    },
    computed: {

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
