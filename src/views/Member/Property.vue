<template>
  <div class="panel">
    <header class="panel-heading">
      会员资产管理
    </header>
    <div class="conten">
      <div class="block lb">
        日期范围:
        从
        <el-date-picker
          v-model="BeginTime"
          style="width: 200px;"
          @change="changeFn"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
        到
        <el-date-picker
          v-model="EndTime"
          style="width: 200px;"
          type="datetime"
          @change="changeFn"
          size="large"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
        货币类型
        <template>
          <el-select v-model="label" clearable placeholder="请选择" @change="chan($event)">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in options"
              :key="item.CurrencyID"
              :label="item.CurrencyName + '[' + item.Unit + ']'"
              :value="item.CurrencyID">
            </el-option>
          </el-select>
        </template>
      </div>
      <div class="block lb" style="padding: 10px 0;">
        用户编号：<el-input type="Number" v-model="UserID" placeholder="请输入内容"></el-input>
        用户姓名：<el-input v-model="FullName" placeholder="请输入内容"></el-input>
        手机号码：<el-input v-model="PhoneNumber" placeholder="请输入内容"></el-input>
        Email：<el-input v-model="Email" placeholder="请输入内容"></el-input>
        <el-button type="danger" @click="handleSearch" >搜索</el-button>
        <el-button type="success" @click="refresh">刷新</el-button>
      </div>
      <!--ref="multipleTable"
      @selection-change="selsChange"
      :data="tableData"
      tooltip-effect="dark"-->
      <div style="margin-top: 10px;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          highlight-current-row
          @selection-change="selsChange"
          style="width: 100%">
          <el-table-column
            label="用户编号"
            prop="UserID"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="FullName"
            label="姓名"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="PhoneNumber"
            label="手机号码"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="Email"
            label="Email"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="Unit"
            label="货币单位"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="BlockAddr"
            label="区块链地址"
            width="400"
            align="center">
          </el-table-column>
          <el-table-column 
            align="center"
            label="余额"
            width="150">
               <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Balance)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            align="center"
            label="可用"
            width="150">
             <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Available)}}</span> 
            </template>
          </el-table-column>
          <el-table-column 
            label="冻结"
            align="center"
            width="100">
             <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Frozen)}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            align="center"
            label="创建时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作"
            align="center"
            width="120">
            <template slot-scope="scope" v-if="editShow">
              <el-button type="primary" size="mini" round @click="handEnter(scope.row)">充值</el-button>
            </template>
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

      <div>
        <el-dialog title="充值" width="580px;" style="color:#fff" :visible.sync="dialogVisible" :before-close="clearContent">
          <el-form label-width="100px" label-position="left">
            <el-form-item label="用户编号">
              <el-input v-model="UserId2" style="width: 300px;" disabled placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="币种">
              <el-input v-model="Unit2" style="width: 300px;" disabled placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="金额">
              <el-input v-model="Amount2" style="width: 300px;" placeholder="请输入金额"></el-input>
              <p style="color: red">可以为负资产</p>
            </el-form-item>
          </el-form>
          <footer slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitBtn">提交</el-button>
          </footer>
        </el-dialog>
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
        UserID: '',
        FullName: '',
        PhoneNumber: '',
        Email: '',
        ids: [],
        isCheck: false,
        sels: '',
        options: [],
        label: '',
        value: '',
        istr: '',
        valueText: '',
        editShow: false,
        celf:'',
        dialogVisible: false,
        UserId2:'',
        Unit2:'',
        Amount2:''
      }

    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getMemberList();
      this.getMonList();
      let path = this.$route.path
      let pvalue = until.getPath((path).substr(1));
      this.editShow = (pvalue&2)==2?true:false;
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    computed: {
      timeDiff: function () {
        if (this.BeginTime == "" && this.EndTime == ""){
          return false;
        } else {
          var e = new Date (this.EndTime);
          var s = new Date (this.BeginTime);
          var result = e - s;
          if (result > 0) {
            return false;
          } else {
            return true;
          }
        }
      }
    },
    methods: {
      refresh(){
        this.BeginTime = ''
        this.EndTime = ''
        this.Email = ''
        this.PhoneNumber = ''
        this.UserID = ''
        this.PageIndex=1
        this.label = '全部';
        this.value = ''
        this.FullName = ''
        this.getMemberList()
      },
      changeFn() {
        if (this.BeginTime == "" && this.EndTime == "") {
          this.istr = false;
        } else if (this.BeginTime != "" && this.EndTime == "") {
          this.istr = true;
        } else if (this.BeginTime == "" && this.EndTime != "") {
          this.istr = true;
        } else {
          var e = new Date (this.EndTime);
          var s = new Date (this.BeginTime);
          var result = e - s;
          if (result > 0) {
            this.istr = false;
          } else if (result==0) {
            this.istr = false;
          } else {
            this.istr = true;
          }
        }
      },
      selsChange(sels) {
        this.sels = sels
      },
      handEnter(ceel){
        this.dialogVisible = true;
        this.UserId2 = ceel.UserID;
        this.Unit2 = ceel.Unit;
        this.Amount2 = '';
      },
      clearContent(){
        this.dialogVisible = false;
        /*this.form = {};
        this.getForm = {};*/
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
          url: baseUrl + 'User/Asset',
          data: {
            'PageIndex': self.PageIndex,
            'PageSize': self.PageSize,
            'BeginTime': self.BeginTime,
            'EndTime': self.EndTime,
            'UserID': self.UserID,
            'FullName': self.FullName,
            'PhoneNumber': self.PhoneNumber,
            'Email': self.Email,
            'CurrencyID': self.value
          }
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result.data.Data.DataList || [];
            self.tableData = res;
            self.totalCount = result.data.Data.TotalCount;
          }
        });
      },
      submitBtn() {
        let self = this;
        if (!self.Amount2) {
          self.$message({
            type: "error",
            message: "请输入金额!",
          });
          return
        }
        var reg=/^[+-]?\d+(\.\d{1,6})?$/;
        if(!reg.test(self.Amount2)){
          self.$message({
            type: "error",
            message: "只能输入数字(最多6位小数)!",
          });
          return false;
        }
        this.$axios({
          method: "post",
          url: baseUrl + 'User/UpdateAsset',
          data: {
            'UserId': self.UserId2,
            'Unit': self.Unit2,
            'Amount': self.Amount2
          }
        }).then((result) => {
          if (until.responesValidate(result)) {
            self.$message({
              type: "success",
              message: "充值成功!",
              onClose: () => {
                self.getMemberList()
                self.dialogVisible = false;
              }
            });
          }
        });
      },
      getMonList() {
        let self = this;
        self.$axios({
          method: "get",
          url: baseUrl + 'Currency/QueryCurrencyPage?pageindex=1&pagesize=100',
          data: ''
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result.data.Data.DataList || [];
            self.options = res;
            self.label = '全部';
            self.value = '';
          }
        });
      },
      chan (item) {
        this.value = item;
      },
      handleSearch() {
        this.PageIndex = 1;
        this.getMemberList ();
      },
      selsChange(sels) {
        this.celf = sels
      },
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getMemberList();
      },
      handleCurrentChange(val) {
        this.PageIndex = val;
        this.getMemberList ();
      },
      stFn(IdentifyStatus) {
        if(IdentifyStatus == 0){
          return '未认证'
        } else if (IdentifyStatus == 1) {
          return '初级认证'
        } else if (IdentifyStatus == 2) {
          return '高级认证'
        } else if (IdentifyStatus == 3) {
          return '高级待审核'
        } else if (IdentifyStatus == 4) {
          return '高级审核失败'
        }
      },
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
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
  /deep/ .el-dialog__header {
    background-color: #00A8B3;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn{
      color: #fff;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color:#fff!important;
    }
  }

</style>
