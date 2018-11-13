<template>
  <div class="panel">
    <header class="panel-heading">
      会员信息管理
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
      </div>
      <div class="block lb" style="padding: 10px 0;">
        用户编号：<el-input type="Number" v-model="UserID" placeholder="请输入内容"></el-input>
        用户姓名：<el-input v-model="FullName" placeholder="请输入内容"></el-input>
        手机号码：<el-input v-model="PhoneNumber" placeholder="请输入内容"></el-input>
        Email：<el-input v-model="Email" placeholder="请输入内容"></el-input>
        <el-button type="danger" @click="handleSearch">搜索</el-button>
        <el-button type="success" @click="refresh">刷新</el-button>
      </div>
      <div v-if="editShow">
        <!--<el-button type="primary" size="medium" @click="delGroup(1)">开启交易</el-button>-->
        <!--<el-button type="info" size="medium" @click="delGroup(0)">关闭交易</el-button>-->
        <el-button type="primary" size="medium" @click="Group(1)">开启提现</el-button>
        <el-button type="info" size="medium" @click="Group(0)">关闭提现</el-button>
        <el-button type="primary" size="medium" @click="goData(1)">启动数据</el-button>
        <el-button type="info" size="medium" @click="goData(0)">禁用数据</el-button>
        <el-button type="info" size="medium" @click="closeGo()">取消Google验证码</el-button>
        <el-button type="primary" size="medium" @click="goTop()">升级为商户</el-button>
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
            prop="NickName"
            label="昵称"
            align="center"
            width="80">
          </el-table-column>
          <!-- <el-table-column
            prop="AreaCode"
            label="国家代码"
            align="center"
            width="80"
            show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column
            prop="PhoneNumber"
            label="手机号码"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="Email"
            label="邮箱"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="SafePwd"
            label="资金密码"
            align="center"
            width="80">
            <template slot-scope="scope" >
              <span>{{scope.row.SafePwd?'已认证':'未认证'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="身份认证"
            align="center"
            width="120">
            <template slot-scope="scope" >
              <span v-text="stFn(scope.row.IdentifyStatus)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="Google认证"
            align="center"
            width="80">
            <template slot-scope="scope" >
              <span>{{scope.row.GoogleSecret?'已认证':'未认证'}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="ReferralCode"
            align="center"
            label="推荐人编码"
            width="120">
          </el-table-column>
          <el-table-column
            prop="RefUserCount"
            align="center"
            label="推荐人数"
            width="80">
          </el-table-column> -->
          <el-table-column
            label="交易状态"
            align="center"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.IsEnableTrade?'已开启':'未开启'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="提现状态"
            align="center"
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.IsEnableWithdraw?'已开启':'未开启'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="RecordStatus"
            label="记录状态"
            align="center"
            width="80">
            <template slot-scope="scope">
              <span>{{scope.row.RecordStatus==1?'正常':scope.row.RecordStatus==0?'禁用':'删除'}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="Comments"
            align="center"
            label="备注"
            width="120">
          </el-table-column> -->
          <el-table-column
            align="center"
            label="是否是OTC商家"
            width="120">
            <template slot-scope="scope">
              <span>{{scope.row.IsOtcMerchant==1?'是':'否'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            align="center"
            label="注册时间"
            width="200">
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作"
            align="center"
            width="120">
            <template slot-scope="scope" v-if="editShow">
              <el-button type="primary" size="mini" round @click="$router.push('/MemberEdit?id=' + scope.row.UserID)">编辑</el-button>
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
        istr: true,
        editShow: false
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
        if (this.BeginTime == "" && this.EndTime == "") return false;
        else {
          var e = new Date (this.EndTime);
          var s = new Date (this.BeginTime);
          var result = e - s;
          if (result > 0) return false;
          else return true;
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
      refresh(){
        this.BeginTime = ''
        this.PageIndex=1
        this.EndTime = ''
        this.Email = ''
        this.PhoneNumber = ''
        this.UserID = ''
        this.getMemberList()
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
          url: baseUrl + 'User/BasicInfo?r=' + Math.random(),
          data: {
            'PageIndex': self.PageIndex,
            'PageSize': self.PageSize,
            'BeginTime': self.BeginTime,
            'EndTime': self.EndTime,
            'UserID': parseInt(self.UserID),
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
      delGroup(val) {
        let self = this;
        if (self.sels.length == 0) {
          self.$message({
            type: "error",
            message: "请先选择!",
          });
          return
        }
        var ids = self.sels.map(item => item.UserID)//获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios({
          method: "post",
          url: baseUrl + 'User/UpdateTradeStatusByIDs?r=' + Math.random(),
          data: {
            ids: ids,
            status: val
          }
        }).then((result) => {
          if (val===1) {
            if (result.data.Status) {
              self.$message({
                type: "success",
                message: "开启成功!",
                onClose: () => {
                  self.getMemberList()
                }
              });
            } else {
              self.$message({
                type: "error",
                message: result.data.Msg,
                onClose: () => {
                  this.$router.back(-1)
                }
              });
            }
          } else {
            if (result.data.Status) {
              self.$message({
                type: "success",
                message: "关闭成功!",
                onClose: () => {
                  self.getMemberList()
                }
              });
            } else {
              self.$message({
                type: "error",
                message: result.data.Msg,
                onClose: () => {
                  this.$router.back(-1)
                }
              });
            }
          }
        });
      },
      Group(val) {
        let self = this;
        if (self.sels.length == 0) {
          self.$message({
            type: "error",
            message: "请先选择列表!",
          });
          return
        }
        var ids = self.sels.map(item => item.UserID)//获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios({
          method: "post",
          url: baseUrl + 'User/UpdateWithdrawStatusByIDs?r=' + Math.random(),
          data: {
            ids: ids,
            status: val
          }
        }).then((result) => {
          if (val===1) {
            if (result.data.Status) {
              self.$message({
                type: "success",
                message: "开启成功!",
                onClose: () => {
                  self.getMemberList()
                }
              });
            } else {
              self.$message({
                type: "error",
                message: result.data.Msg,
                onClose: () => {
                  self.getMemberList()
                }
              });
            }
          } else {
            if (result.data.Status) {
              self.$message({
                type: "success",
                message: "关闭成功!",
                onClose: () => {
                  self.getMemberList()
                }
              });
            } else {
              self.$message({
                type: "error",
                message: result.data.Msg,
                onClose: () => {
                  self.getMemberList()
                }
              });
            }
          }
        });
      },
      goData(val) {
        let self = this;
        if (self.sels.length == 0) {
          self.$message({
            type: "error",
            message: "请先选择列表!",
          });
          return
        }
        var ids = self.sels.map(item => item.UserID)//获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios({
          method: "post",
          url: baseUrl + 'User/UpdateUserStatusByIDs?r=' + Math.random(),
          data: {
            ids: ids,
            status: val
          }
        }).then((result) => {
          if (val == 0) {
            if (result.data.Status) {
              self.$message({
                type: "success",
                message: "禁用成功!",
                onClose: () => {
                  self.getMemberList()
                }
              });
            }
          } else {
            if (result.data.Status) {
              self.$message({
                type: "success",
                message: "启用成功!",
                onClose: () => {
                  self.getMemberList()
                }
              });
            }
          }
        });
      },
      closeGo(val) {
        let self = this;
        if (self.sels.length == 0) {
          self.$message({
            type: "error",
            message: "请先选择列表!",
          });
          return
        }
        var ids = self.sels.map(item => item.UserID)//获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios({
          method: "post",
          url: baseUrl + 'User/ResetGoogleCodeByIDss?r=' + Math.random(),
          data: ids
        }).then((result) => {
          if (result.data.Status) {
            self.$message({
              type: "success",
              message: "取消成功!",
              onClose: () => {
                self.getMemberList()
              }
            });
          } else {
            self.$message({
              type: "error",
              message: result.data.Msg,
              onClose: () => {
                self.getMemberList()
              }
            });
          }
        });
      },
      goTop(val) {
        let self = this;
        if (self.sels.length == 0) {
          self.$message({
            type: "error",
            message: "请先选择列表!",
          });
          return
        }
        var ids = self.sels.map(item => item.UserID)//获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios({
          method: "post",
          url: baseUrl + 'User/UpdateOtcMerchantStatus?r=' + Math.random(),
          data: {
            Ids: ids,
            status: 1
          }
        }).then((result) => {
          if (result.data.Status) {
            self.$message({
              type: "success",
              message: "操作成功!",
              onClose: () => {
                self.getMemberList()
              }
            });
          } else {
            self.$message({
              type: "error",
              message: result.data.Msg,
              onClose: () => {
                self.getMemberList()
              }
            });
          }
        });
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
