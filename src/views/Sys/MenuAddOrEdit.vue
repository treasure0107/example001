<template>
  <div class="panel">
    <header class="panel-heading"><span v-if="!isShow">添加菜单管理</span><span v-if="isShow">修改菜单管理</span></header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="菜单类型">
          <el-select v-model="form.MenuType" placeholder="菜单类型" :disabled="isShow" class="el-select-re"
                     @change="change(form.MenuType)">
            <el-option label="---请选择---" value=""></el-option>
            <el-option label="Menu" value="0"></el-option>
            <el-option label="Api" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父菜单" v-if="isMenu">
          <el-select v-model="form.ParentMenuID" placeholder="父菜单" class="el-select-re"
                     @change="changeParentMenu(form.ParentMenuID)">
            <el-option label="---无---" value="0"></el-option>
            <el-option
              v-for="item in ParentMenuList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名">
          <el-input v-model="form.MenuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单英文名">
          <el-input v-model="form.MenuName_EN"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标样式">
          <el-input v-model="form.MenuFaName"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址">
          <el-input v-model="form.LinkUrl" :disabled="isParentMenu"></el-input>
          <div style="font-size:14px; color:#f56c6c;"> 注：一级菜单仅作为分类展示，不能添加链接地址</div>
        </el-form-item>
        <el-form-item label="父菜单" v-if="!isMenu">
          <!--  :default-expand-all="true"-->
          <el-tree
            :data="MenuTreesList"
            node-key="id"
            show-checkbox
            :default-checked-keys="treeList"
            :default-expanded-keys="treeList"
            ref="tree"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item label="权限类别" v-if="!isMenu">
          <template>
            <el-checkbox-group v-model="PermissionTypeList">
              <el-checkbox label="1">新增</el-checkbox>
              <el-checkbox label="2">编辑</el-checkbox>
              <el-checkbox label="4">删除</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>

        <el-form-item label="排列序号">
          <el-input v-model="form.OrderByNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>

    </section>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  export default {
    data(){
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        id: '',
        ParentMenuList: [],
        MenuTreesList: [],
        treeList: [],
        PermissionTypeList: [],
        isEdit: '',
        isShow: true,
        isMenu: true,
        isParentMenu: true,
        form: {
          MenuID: 0,
          MenuFaName: "",
          MenuName: "",
          MenuName_EN: "",
          LinkUrl: "",
          ParentMenuID: '0',
          OrderByNo: 0,
          MenuType: '',
          ApiParentIDs: [],
          PermissionType: [],
        },
      }
    },
    created(){
      this.isEdit = this.$route.query.isEdit;
      if (this.isEdit == 1) {
        this.id = this.$route.query.id;
      }
    },
    mounted(){
      this.getMenuList();
      this.GetMenuTrees();
      if (this.isEdit == 1) {
        this.isShow = true;
        this.getDetails();
      } else {
        this.isShow = false;
      }
    },
    methods: {
      change(item){
        if (item == 1) {
          this.isMenu = false;
          this.isParentMenu = false;
        } else {
          this.isMenu = true;
          this.isParentMenu = true;
        }
      },
      changeParentMenu(item){
        if (item == 0) {
          this.isParentMenu = true;
        } else {
          this.isParentMenu = false;
        }
      },
      GetMenuTrees(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "SysApi/GetMenuTrees?p=false",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.MenuTreesList = res.data.Data;
//              console.log(this.MenuTreesList);
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getMenuList(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "SysApi/AdminMenuList?isLv1=true",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.ParentMenuList = res.data.Data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "SysApi/GetAdminMenuById/" + this.id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.form = res.data.Data;
              this.form.MenuType = this.form.MenuType.toString();
              if (this.form.ParentMenuID == 0) {
                this.form.ParentMenuID = "0";
                this.isParentMenu = true;
              } else {
                this.isParentMenu = false;
              }
              if (this.form.MenuType == 1) {
                this.isMenu = false;
                this.isParentMenu = false;
                res.data.Data.BizPermissionType.map((item) => {
                  return this.PermissionTypeList.push(item.toString())
                });
                this.form.ApiParentIDs = res.data.Data.ApiParentIDs.split(",");
                this.treeList = this.form.ApiParentIDs;
              }
              if (this.form.MenuType == 0) {
                this.isMenu = true;
              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        /*    for(var i=0;i<this.PermissionType.length;i++){
         this.form.PermissionType |=this.PermissionType[i];
         //          return this.form.PermissionType;
         }*/
        this.form.PermissionType = this.PermissionTypeList;
        if (this.dataValidate()) {
          if (!this.isMenu) {
            this.form.ApiParentIDs = [];
            this.$refs.tree.getCheckedNodes().forEach((val) => {
              if (val.children == null) {
                return this.form.ApiParentIDs.push(val.id)
              }
            });
          }
          try {
            let config = {
              method: "POST",
              url: baseUrl + "SysApi/SaveAdminMenu",
              data: this.form
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                if (res.data.Data) {
                  this.$message({
                    type: "success",
                    duration: 1000,
                    message: res.data.Msg || "提交成功！",
                    onClose: () => {
                      this.$router.push('/MenuManagement');
                    }
                  });
                } else {
                  this.$message({
                    type: "error",
                    duration: 1000,
                    message: res.data.Msg || "提交失败！",
                  });
                }

              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
        }
      },
      dataValidate(){
        if (!this.form.MenuType) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "菜单类型不能为空！",
          });
          return false;
        }
        if (!this.form.MenuName) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "菜单名不能为空！",
          });
          return false;
        }
        return true;
      }
    },
    components: {}
  }
</script>
<style lang="scss" scoped>
  .form {
    margin-top: 30px;
    padding-bottom: 30px;
    margin-left: 100px;
  }

  /deep/ .el-input, .el-textarea {
    width: 460px;
  }

  /deep/ .el-textarea__inner {
    height: 360px;
  }
</style>
