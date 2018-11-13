<template>
  <div class="panel">
    <header class="panel-heading">
      身份认证管理
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
        身份认证状态
        <template>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
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
        <el-button type="primary" size="medium" @click="delGroup(2)">审核通过</el-button>
        <el-button type="info" size="medium" @click="delGroup(4)">驳回申请</el-button>
      </div>
      <!--<div>
        <el-button type="primary" size="medium" @click="delGroup(2)">审核通过</el-button>
        <el-button type="info" size="medium" @click="delGroup(4)">驳回申请</el-button>
      </div>-->
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
            prop="CardID"
            label="身份证号码"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            label="身份证正面"
            align="center"
            width="110">
            <template slot-scope="scope">
              <img style="width: 40px;" v-if="scope.row.CardFrontImg" :src="scope.row.CardFrontImg" @click="bigFn(scope.row.CardFrontImg)" class="imgIcon">
            </template>
          </el-table-column>
          <el-table-column
            label="身份证反面"
            align="center"
            width="110">
            <template slot-scope="scope">
              <img style="width: 40px;" v-if="scope.row.CardBackImg" :src="scope.row.CardBackImg" @click="bigFn(scope.row.CardBackImg)" class="imgIcon">
            </template>
          </el-table-column>
          <el-table-column
            label="手持身份证"
            align="center"
            width="110">
            <template slot-scope="scope">
              <img style="width: 40px;" v-if="scope.row.CardHandImg" :src="scope.row.CardHandImg" @click="bigFn(scope.row.CardHandImg)" class="imgIcon">
            </template>
          </el-table-column>
          <!--<el-table-column
            prop="FirstName"
            label="名"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="LastName"
            label="姓"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="Address"
            label="地址"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="PassportNo"
            label="护照号码"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            label="护照页照片"
            align="center"
            width="110">
            <template slot-scope="scope">
              <img style="width: 40px;" v-if="scope.row.PassportImg" :src="scope.row.PassportImg" @click="bigFn(scope.row.PassportImg)" class="imgIcon">
            </template>
          </el-table-column>-->
          <el-table-column
            label="手持护照页照片"
            align="center"
            width="110">
            <template slot-scope="scope">
              <img style="width: 40px;" v-if="scope.row.PassportHandImg" :src="scope.row.PassportHandImg" @click="bigFn(scope.row.PassportHandImg)" class="imgIcon">
            </template>
          </el-table-column>
          <el-table-column
            label="身份认证状态"
            align="center"
            width="80">
            <template slot-scope="scope" >
              <span v-if="scope.row.IdentifyStatus" v-text="stFn(scope.row.IdentifyStatus)"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="AuditUserFullName"
            label="审核人"
            width="110"
            align="center">
          </el-table-column>
          <el-table-column
            prop="AuditTime"
            align="center"
            label="审核时间"
            width="170">
          </el-table-column>
          <el-table-column
            prop="CommitTime"
            align="center"
            label="高级实名认证提交时间"
            width="170">
          </el-table-column>
          <el-table-column
            prop="Comments"
            align="center"
            label="备注"
            width="200">
          </el-table-column>
          <!--<el-table-column
            prop="name"
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope" v-if="scope.row.IdentifyStatus==3 && editShow">
              <el-button type="primary" size="mini" @click="delGroup(2,scope.row.ID)">审核通过</el-button>
              <el-button type="info" size="mini" @click="delGroup(4,scope.row.ID)">驳回申请</el-button>
            </template>
          </el-table-column>-->
        </el-table>
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
      </div>
      <div class="mui-backdrop" v-if="isShow">
        <div class="conImg">
          <el-button style="float: right;margin-right: 5px;margin-top: 5px;" type="info" size="mini" @click="clo()">关闭</el-button>
          <el-button style="float: right;margin-right: 5px;margin-top: 5px;" type="primary" size="mini" @click="xzFn()">旋转</el-button>
          <img id="imgg" :src="sc" style="width: 300px;margin-left: 100px;margin-top: 20px;" alt="">
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
        addr: '',
        isCheck: false,
        sels: '',
        options: [{
          value: '',
          label: '全部'
        },{
          value: '1',
          label: '初级认证'
        },{
          value: '2',
          label: '高级认证'
        },{
          value: '3',
          label: '高级审核中'
        },{
          value: '4',
          label: '高级审核失败'
        },],
        value: '',
        current: 0,
        sc: '',
        isShow: false,
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
      xzFn() {
        this.current = (this.current+90)%360;
        document.getElementById('imgg').style.transform = 'rotate('+this.current+'deg)';
      },
      clo() {
        this.isShow = false
      },
      refresh(){
        this.BeginTime = ''
        this.EndTime = ''
        this.Email = ''
        this.PhoneNumber = ''
        this.UserID = ''
        this.FullName = ''
        this.PageIndex=1
        this.value = ''
        this.label = '全部';
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
          url: baseUrl + 'User/Identity?r=' + Math.random(),
          data: {
            'PageIndex': self.PageIndex,
            'PageSize': self.PageSize,
            'EndTime': self.EndTime,
            'UserID': self.UserID,
            'FullName': self.FullName,
            'PhoneNumber': self.PhoneNumber,
            'Email': self.Email,
            'IdentifyStatus': self.value
          }
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result.data.Data.DataList || [];
            self.tableData = res;
            self.totalCount = result.data.Data.TotalCount;
          }
        });
      },
      bigFn (Src) {
        this.isShow = true;
        this.sc = Src;
      },
      delGroup(val) {
        let self = this;
        if (self.sels.length == 0) {
          this.$message({
            type: "error",
            message: "请先选择数据!",
          });
          return false;
        }
        var ids = self.sels.map(item => item.ID)//获取所有选中行的id组成的字符串，以逗号分隔
        this.$axios({
          method: "post",
          url: baseUrl + 'User/UpdateIdentityStatusByIDs?r=' + Math.random(),
          data: {
            ids: ids,
            status: val
          }
        }).then((result) => {
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
            else {
              self.$message({
                type: "error",
                message: result.data.Msg
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
            else {
              self.$message({
                type: "error",
                message: result.data.Msg
              });
            }
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
  .allBlack {
    position: fixed;
  }
  #modal{
    position:absolute;
    width:500px;
    height:300px;
    top:40%;
    left:40%;
    background-color:#fff;
    display:block;
    cursor:pointer;
    z-Index:9999;
  }
  .mui-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 998;
    background-color: rgba(0,0,0,.3);
  }
  .conImg {
    margin: auto;
    margin-top: 15%;
    background: #fff;
    width: 500px;
    height: 500px;
  }
</style>
