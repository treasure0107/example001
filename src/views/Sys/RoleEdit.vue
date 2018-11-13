<template>
  <div class="panel">
    <header class="panel-heading">{{tir}}角色信息</header>
    <section>
      <el-form ref="form" label-width="200px" class="form">
        <el-form-item label="角色名称" >
          <el-input :disabled="des" v-model="RoleName"></el-input>
        </el-form-item>
        <el-form-item label="权限列表" prop="">
          <el-tree
            :data="data"
            show-checkbox
            :default-checked-keys="checkArr"
            :default-expanded-keys="checkArr"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCheckedKeys">提交</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import country from "@/views/Member/country";
  import { quillEditor } from 'vue-quill-editor'
  export default {
    data(){
      return {
        id: '',
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        arr3: [],
        options: [],
        value: 0,
        checkArr: [],
        RoleName: '',
        des: true,
        tir: '',
        arrTree: [],
        flag: true,
        arrTT:[]
      }

    },
    created(){
    },
    mounted(){
      this.id = this.$route.query.id;
      if (this.id != '0') {
        this.tir = '修改';
        this.init();
      } else {
        this.tir = '新增';
        this.des = false;
        this.$axios({
          method: "GET",
          url: baseUrl + 'SysApi/GetMenuTrees?p=true'
        }).then((result) => {
            if (until.responesValidate(result)) {
              let res = result["data"]["Data"];
              this.data=res;
            }
        })
      }
//      this.options = country.getData();
//      this.getDetails();
    },
    methods: {
      getCheckedKeys() {
        var self = this;
        self.arr3 = []
        let arr = self.$refs.tree.getCheckedKeys();
        let arr2 = [];
        for(var i = 0; i<arr.length; i++) {
          if (arr[i].indexOf("_") != -1){
            arr2.push(arr[i]);
          }
        }
        for(var j = 0; j<arr2.length; j++) {
          self.arr3.push({
            'RoleID' : self.value,
            'RoleName' : self.RoleName,
            'MenuID' : arr2[j].split("_")[0],
            'PermissionValue' : arr2[j].split("_")[1],
          })
        }
        self.$axios({
          method: "post",
          url: self.$config.url + 'SysApi/SaveAdminRoleMenu',
          data:self.arr3
        }).then((result) => {
          if (until.responesValidate(result)) {
            this.$axios({
              method: "GET",
              url: baseUrl + '/SysApi/GetMenuListAndPermissionList'
            }).then((result) => {
              if (until.responesValidate(result)) {
                let res = result["data"]["Data"];
                window.localStorage.setItem('MenuList',JSON.stringify(res.MenuList));   //菜单栏
                window.localStorage.setItem('RoleMenuList',JSON.stringify(res.RoleMenuList));   //权限
                this.$message({
                  message: "操作成功",
                  type: "success",
                  onClose: function () {
                    self.$router.back(-1)
                  }
                });
              }
            })
          }
        });
      },
      /* 初始化 */
      init(){
        this.$axios({
          method: "GET",
          url: baseUrl + 'SysApi/GetMenuTrees?p=true'
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result["data"]["Data"];
            this.data=res;
            this.$axios({
              method: "GET",
              url: baseUrl + 'SysApi/GetAllAdminRolesListForList/' + this.id
            }).then((result) => {
              if (until.responesValidate(result)) {
                let res = result["data"]["Data"];
                this.options=res;
                this.$axios({
                  method: "GET",
                  url: baseUrl + 'SysApi/GetAdminRoleMenuByRoleId?roleId=' + this.id
                }).then((result) => {
                  if (until.responesValidate(result)) {
                    let res = result["data"]["Data"];
                    this.value = res.RoleId;
                    this.RoleName = res.RoleName
                    this.checkArr = res.TreeNodeIds;
                    for(var i = 0; i<this.checkArr.length; i++) {
                      this.arrTree.push({
                        id: this.checkArr[i]
                      })
                    }
                    this.$refs.tree.setCheckedNodes(this.arrTree);
                  }
                });
              }
            });
          }
        });
      },
      handleAvatarSuccessGzh(res, file) {
        //this.CardInfoUrlShow=URL.createObjectURL(file.raw);
        this.form.ImgUrl=res.Data.SavePath;
//        this.ServiceWechatWpShow=res.Data.SavePath;
        this.ImgUrlShow=URL.createObjectURL(file.raw);
//        this.ImgUrlShow=res.Data.ShowPath;
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
        const isLt600kb = file.size / 1024  < 600;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG或PNG 格式!');
        }
        if (!isLt600kb) {
          this.$message.error('上传图片大小不能超过 600kb!');
        }
        return isJPG && isLt600kb;
      },
      chanck(a,b,c){
        let key = a.id;
        if (key.indexOf("_") != -1) {
          if(b){
            var arr5 = []
            for(var i = 0; i<this.arrTree.length; i++) {
              arr5.push(this.arrTree[i].id);
            }
            if (arr5.indexOf(key) != -1){
            } else {
              this.arrTree.push({
                id: key.split("_")[0]+'_0'
              },{
                id: key
              })
            }
            /*var result1 = []
            for(var q = 0; q < this.arrTree.length; q++){
              for(var j = q + 1; j < this.arrTree.length; j++){
                if(this.arrTree[q].id === this.arrTree[j].id){
                  j = ++q;
                }
              }
              this.arrTT.push(this.arrTree[q]);
            }*/
            this.$refs.tree.setCheckedNodes(this.arrTree);
          } else {
            if (key.split("_")[1] == '0') {
              for(var i = 0; i<this.arrTree.length; i++) {
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_0'){
                    this.arrTree.splice(i, 1);
                  }
                }
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_1'){
                    this.arrTree.splice(i, 1);
                  }
                }
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_2'){
                    this.arrTree.splice(i, 1);
                  }
                }
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_3'){
                    this.arrTree.splice(i, 1);
                  }
                }
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_4'){
                    this.arrTree.splice(i, 1);
                  }
                }
              }
              for(var i = 0; i<this.arrTree.length; i++) {
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_0'){
                    this.arrTree.splice(i, 1);
                  }
                }
              }
              for(var i = 0; i<this.arrTree.length; i++) {
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_0'){
                    this.arrTree.splice(i, 1);
                  }
                }
              }
              for(var i = 0; i<this.arrTree.length; i++) {
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_0'){
                    this.arrTree.splice(i, 1);
                  }
                }
              }
              for(var i = 0; i<this.arrTree.length; i++) {
                if (this.arrTree[i]) {
                  if(this.arrTree[i].id == key.split("_")[0]+'_0'){
                    this.arrTree.splice(i, 1);
                  }
                }
              }
              this.$refs.tree.setCheckedNodes(this.arrTree);
            } else if (key.split("_")[1] != '0') {
              for(var i = 0; i<this.arrTree.length; i++) {
                if(this.arrTree[i].id == key){
                  this.arrTree.splice(i, 1);
                }
              }
              this.$refs.tree.setCheckedNodes(this.arrTree);
            }
          }
        } else {}
      },
      distinct(arr) {
        let result = [];
        for(var i = 0; i < arr.length; i++){
          for(var j = i + 1; j < arr.length; j++){
            if(arr[i] === arr[j]){
              j = ++i;
            }
          }
          result.push(arr[i]);
        }
        return result;
      },
      onEditorBlur(editor){//失去焦点事件
      },
      onEditorFocus(editor){//获得焦点事件
      },
      onEditorChange({editor,html,text}){//编辑器文本发生变化
        //this.content可以实时获取到当前编辑器内的文本内容
        console.log(this.VerifyCodeTPL);
      },
      onEditorBlur2(editor){//失去焦点事件
      },
      onEditorFocus2(editor){//获得焦点事件
      },
      onEditorChange2({editor,html,text}){//编辑器文本发生变化
        //this.content可以实时获取到当前编辑器内的文本内容
        console.log(this.VerifyCodeTPL_EN);
      }
    },
    components: {
      quillEditor
    }
  }

</script>

<style lang="scss" scoped>

  .form{margin-left: 0px;padding: 10px 0;width: 800px;}
  .input-des{line-height: 20px;height: 20px;margin-bottom: 5px;font-size: 12px;}


  /deep/ .upload{
    border: 1px solid #CCC;
    background-color: #FFF;
    padding: 4px;
    display: inline-block;
    max-width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
    width: 208px;
    height: 68px;
  }
  /deep/ .upload img{width: 200px;height: 60px;}
  /deep/ .avatar-uploader-icon{width: 100%;height: 100%;display: block;line-height: 58px;color: #777575;}
  /deep/ .el-upload--text{width: 100%;height: 100%;display: block;}
</style>
