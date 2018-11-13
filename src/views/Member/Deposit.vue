<template>
  <div class="panel">
    <header class="panel-heading">
      提现地址管理
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
          @change="changeFn"
          type="datetime"
          size="large"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="block lb" style="padding: 10px 0;">
        用户编号：<el-input type="Number" v-model="UserID" placeholder="请输入内容"></el-input>
        用户姓名：<el-input v-model="FullName" placeholder="请输入内容"></el-input>
        手机号码：<el-input v-model="PhoneNumber" placeholder="请输入内容"></el-input>
        Email：<el-input v-model="Email" placeholder="请输入内容"></el-input>
        <el-button type="danger" @click="handleSearch">搜索</el-button>
      </div>
      <div style="margin-top: 10px;">
        <el-table
          ref="multipleTable"
          @selection-change="selsChange"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
            width="200">
          </el-table-column>
          <el-table-column
            prop="CurrencyName"
            label="货币名称"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="BlockAddr"
            label="提现地址"
            width="400"
            align="center">
          </el-table-column>
          <el-table-column
            prop="Memo"
            align="center"
            label="地址标签"
            width="150">
          </el-table-column>
          <el-table-column
            prop="RecordStatus"
            align="center"
            label="记录状态"
            width="150">
            <template slot-scope="scope" >
              <span v-text="stFn(scope.row.RecordStatus)"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            align="center"
            label="创建时间"
            width="200">
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
        UserID: '',
        FullName: '',
        PhoneNumber: '',
        Email: '',
        ids: [],
        isCheck: false,
        sels: '',
        options: [],
        value: '',
        istr: ''
      }

    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getMemberList();
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
          url: baseUrl + 'User/WithdrawAccount?r=' + Math.random(),
          data: {
            'PageIndex': self.PageIndex,
            'PageSize': self.PageSize,
            'BeginTime': self.BeginTime,
            'EndTime': self.EndTime,
            'UserID': self.UserID,
            'FullName': self.FullName,
            'PhoneNumber': self.PhoneNumber,
            'Email': self.Email
          }
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result.data.Data.DataList;
            self.tableData = res;
            self.totalCount = result.data.Data.TotalCount;
          }
        });
      },
      handleSearch() {
        this.PageIndex = 1;
        this.getMemberList ();
      },
      selsChange(sels) {
        this.sels = sels
      },
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getMemberList();
      },
      handleCurrentChange(val) {
        this.PageIndex = val;
        this.getMemberList ();
      },
      stFn(val) {
        if(val == 0){
          return '禁用'
        } else if (val == 1) {
          return '正常'
        } else {
          return '已删除'
        }
      },
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
