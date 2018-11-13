<template>
  <div class="panel">
    <header class="panel-heading">
      站内互转管理
    </header>
    <div class="conten">
      <div class="block lb" style="padding: 10px 0;">
        转账状态:
        <template>
          <el-select v-model="TransferStatus" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="转账成功" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核中" value="0"></el-option>
            <el-option label="转账失败" value="-1"></el-option>
            <el-option label="审核失败" value="-2"></el-option>
            <el-option label="取消" value="-3"></el-option>
          </el-select>
        </template>
        用户姓名：<el-input v-model="UserName" placeholder="请输入内容"></el-input>
        手机号码：<el-input v-model="PhoneNumber" placeholder="请输入内容"></el-input>
        Email：<el-input v-model="Email" placeholder="请输入内容"></el-input>
        <el-button type="danger" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="refresh">刷新</el-button>
      </div>
      <div style="margin-top: 10px;">
        <el-table
          ref="multipleTable"
          @selection-change="selsChange"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="收账人姓名"
            prop="InUserName"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="InPhoneNumber"
            label="收账人电话"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="InEmail"
            label="收账人邮箱"
            align="center">
          </el-table-column>
          <el-table-column
            prop="OutUserName"
            label="转出人姓名"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="OutPhoneNumber"
            label="转出人电话"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="OutEmail"
            label="转出人邮箱"
            align="center">
          </el-table-column>
          <el-table-column
            prop="CurrencyName"
            label="货币名称"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="Unit"
            label="币种单位"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            prop="TransferStatus"
            align="center"
            label="转账状态"
            width="100">
            <template slot-scope="scope" >
              <span v-text="stFn(scope.row.TransferStatus)"></span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="转账金额"
            width="100">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.TransferVolume)}}</span> 
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
            width="200">
            <template slot-scope="scope" v-if="scope.row.TransferStatus==0 && editShow">
              <el-button type="primary" size="mini" @click="isshFn(2,scope.row.ID,1)">审核通过</el-button>
              <el-button type="info" size="mini" @click="isshFn(-2,scope.row.ID,0)">驳回申请</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="PageIndex"
          :page-size="PageSize"
          layout="total, prev, pager, next"
          :total="totalCount">
        </el-pagination>
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
        UserID: '',
        UserName: '',
        PhoneNumber: '',
        Email: '',
        ids: [],
        isCheck: false,
        sels: '',
        options: [],
        value: '',
        istr: '',
        TransferStatus: ''
      }

    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getMemberList();
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
      isshFn (val,id,edu) {
        if (edu==1) {
          this.$confirm('是否确定审核通过?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delGroup(val,id);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消审核'
            });
          });
        } else {
          this.$confirm('是否确定驳回申请?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delGroup(val,id);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消驳回'
            });
          });
        }
      },
      delGroup(val,id) {
        let self = this;
//        var ids = self.sels.map(item => item.UserID)//获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios({
          method: "post",
          url: baseUrl + 'User/DoAuditTransferAsset?r=' + Math.random(),
          data: {
            Id: id,
            TransferStatus: val
          }
        }).then((result) => {
          if (until.responesValidate(result)) {
            if (val===2) {
              if (result.data.Status) {
                self.$message({
                  type: "success",
                  message: "审核成功!",
                  onClose: () => {
                    self.getMemberList()
                  }
                });
              }
            } else {
              if (result.data.Status) {
                self.$message({
                  type: "success",
                  message: "驳回成功!",
                  onClose: () => {
                    self.getMemberList()
                  }
                });
              }
            }
          }
        });
      },
      refresh(){
        this.BeginTime = ''
        this.EndTime = ''
        this.Email = ''
        this.PhoneNumber = ''
        this.UserName = ''
        this.PageIndex=1
        this.TransferStatus = ''
        this.label = '全部';
        this.getMemberList()
      },
      getMemberList() {
        let self = this;
        this.$axios({
          method: "post",
          url: baseUrl + 'User/GetTransferAssetDetailPageList?r=' + Math.random(),
          data: {
            'PageIndex': self.PageIndex,
            'PageSize': self.PageSize,
            'FullName': self.UserName,
            'TransferStatus': self.TransferStatus,
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
      handleCurrentChange(val) {
        this.PageIndex = val;
        this.getMemberList ();
      },
      stFn(val) {
        if(val == -2){
          return '审核失败'
        } else if (val == -1) {
          return '转账失败'
        } else if (val == 0) {
          return '审核中'
        } else if (val == 1) {
          return '转账成功'
        } else if (val == 2) {
          return '审核通过'
        } else if (val == -3) {
          return '取消'
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
