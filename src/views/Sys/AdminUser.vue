<template>
  <div class="panel">
    <header class="panel-heading">
      系统管理员管理
    </header>
    <div style="padding: 20px;">
      <el-button type="success" @click="goEdit(0,'')">新增数据</el-button>
      <el-button type="info" @click="updateByIDs(0,'禁用数据')">禁用数据</el-button>
      <el-button type="primary" @click="updateByIDs(1,'启用数据')">启用数据</el-button>
      <el-button type="danger" @click="updateByIDs(-1,'删除数据')">删除数据</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="DataList"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="用户编号"
        width="190">
        <template slot-scope="scope">{{ scope.row.UserID }}</template>
      </el-table-column>
      <el-table-column
        prop="UserName"
        label="用户名"
        width="190">
      </el-table-column>
      <el-table-column
        prop="FullName"
        label="姓名"
        width="190">
      </el-table-column>
      <el-table-column
        prop="RoleName"
        label="角色"
        width="190">
      </el-table-column>
      <el-table-column
        prop="Comments"
        label="备注"
        width="260">
      </el-table-column>
      <el-table-column
        label="状态" width="160">
        <template slot-scope="scope">
						<span class="label label-success" v-if="scope.row.RecordStatus==1">
							正常
						</span>
          <span class="label label-danger" v-if="scope.row.RecordStatus==0">
							禁用
						</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        width="200">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <button class="bts-btn edit" @click="goEdit(1,scope.row.UserID)"><i class="fa fa-edit"></i></button>
          <button class="bts-btn del" v-if="" @click="updateByIDs(-1,'删除数据',scope.row.UserID)"><i
            class="fa fa-trash-o"></i>
          </button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;"
         v-if="DataList && DataList.length">
      <el-pagination
        prevText="<"
        nextText=">"
        @current-change="handleCurrentChange"
        layout="total,prev, pager, next, jumper"
        :total="totalCount"
        :page-size="PageSize"
        :current-page.sync="PageIndex"
        background>
      </el-pagination>
    </div>

    <el-dialog :title="isEdit" :visible.sync="dialogVisible" width="580px" :before-close="clearContent">
      <el-form ref="adminForm" :model="adminForm" label-width="80px" label-position="left">
        <el-form-item label="用户名" prop="UserName">
          <el-input v-model="adminForm.UserName" :disabled="isShow"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="FullName">
          <el-input v-model="adminForm.FullName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="LoginPwd" v-if="!isShow">
          <el-input type="password" auto-complete="new-password" v-model="adminForm.LoginPwd"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="RoleID">
          <el-select v-model="adminForm.RoleID" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="Phone">
          <el-input v-model="adminForm.Phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="Email">
          <el-input v-model="adminForm.Email"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="Comments">
          <el-input v-model="adminForm.Comments"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
				<el-button @click="dialogClose">取 消</el-button>
				<el-button type="primary" @click="submit">提 交</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
  import until from '@/scripts/until';
  import {baseUrl} from "@/config/env";
  export default {
    data(){
      return {
        DataList: [],
        multipleSelection: [],
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
        dialogVisible: false,
        isShow: false,
        isEdit: '添加管理员',
        options: [],
        value: '',
        adminForm: {
          UserID: 0,
          UserName: "",
          LoginPwd: "",
          FullName: "",
          RoleID: '',
          Phone: '',
          Email: '',
          Comments: ""
        },
        isPath: '',
        isAddPath: '',
        isDelPath: ''
      }
    },
    created(){
      let path = this.$route.path.slice(1, this.$route.path.length);
      this.isPath = until.getPath(path) & 2;
      this.isAddPath = until.getPath(path) & 1;
      this.isDelPath = until.getPath(path) & 4;
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.init();
    },
    methods: {
      init() {
        this.$axios({
          method: "get",
          url: this.$config.url + '/SysApi/AdminUserList?pageindex=' + this.PageIndex + '&pagesize=' + this.PageSize
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result.data.Data;
            this.DataList = res["DataList"];
            this.totalCount = res['TotalCount'];
          }
        });
      },
      getAdminRolesList(id){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "SysApi/GetAllAdminRolesListForList/" + id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.options = res.data.Data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      goEdit(isEdit, id) {  //编辑
        if (isEdit) {
          this.isEdit = '编辑管理员';
          this.isShow = true;
          try {
            let config = {
              method: "GET",
              url: baseUrl + "SysApi/GetAdminUser/" + id,
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                this.adminForm = res.data.Data;
                let RoleID = res.data.Data.RoleID;
                this.getAdminRolesList(RoleID);
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
        } else {
          this.getAdminRolesList(0);
          this.isEdit = '新增管理员';
          this.isShow = false;
        }
        this.dialogVisible = true;
      },
      dialogClose(){
        this.clearContent();
      },
      clearContent(){
        this.adminForm = {};
        this.dialogVisible = false;
      },
      submit(){
        if (!this.isShow) {
          if (!this.adminForm.UserName) {
            this.$message({
              type: "error",
              duration: 1000,
              message: "请输入用户名！",
            });
            return false;
          }
          if (!this.adminForm.LoginPwd) {
            this.$message({
              type: "error",
              duration: 1000,
              message: "请输入密码！",
            });
            return false;
          }
          if (this.adminForm.LoginPwd.length < 6) {
            this.$message({
              type: "error",
              duration: 1000,
              message: "密码长度不能少于6位！",
            });
            return false;
          }
        }
        if (!this.adminForm.UserID) {
          this.adminForm.UserID = 0;
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "SysApi/SaveAdminUser",
            data: this.adminForm
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              if (res.data.Data) {
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: res.data.Msg || "操作成功！",
                  onClose: () => {
                    this.init();
                    this.clearContent();
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
        this.adminForm = {};
      },
      updateByIDs(Status, name, ID){
        this.$confirm('是否确认' + name + '？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateHandle(Status, ID);

        }).catch(() => {
        });
      },
      updateHandle(Status, ID){
        let RecordIds = [];
        if (ID) {
          RecordIds.push(ID)
        } else {
          this.multipleSelection.map((n) => {
            RecordIds.push(n.UserID)
          });
        }

        if (RecordIds.length == 0) {
          this.$message({
            type: "error",
            message: "请先选择数据!",
          });
          return false;
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "SysApi/UpdateAdminUserStatus",
            data: {
              Ids: RecordIds,
              Status: Status
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              if (res.data.Data) {
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: res.data.Msg || "操作成功！",
                  onClose: () => {
                    this.init();
                  }
                });
              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.init();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
  }
</script>

<style lang="scss" scoped>
  .btn-contanier {
    margin: 15px;
  }

  .bts-btn {
    outline: none !important;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    display: inline-block;
    font-size: 12px;
    line-height: 1.5;
    border-radius: 3px;
    padding: 1px 5px;
  }

  .bts-btn.edit {
    background-color: #41cac0;
    border-color: #41cac0;
    color: #FFFFFF;
  }

  .bts-btn.del {
    background-color: #ff6c60;
    border-color: #ff6c60;
    color: #FFFFFF;
  }

  .label {
    display: inline;
    padding: 0.25em 0.8em;
    font-size: 75%;
    font-weight: bold;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
  }

  .label-danger {
    background-color: #FF6C60;
  }

  .label-success {
    background-color: #A9D86E;
  }

  .page-wrap {
    margin: 20px 0;
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

  /*  /deep/ .iconActive .el-input__inner{
      background-color: #FAFFBD;
      color: #000;
    }*/
</style>
