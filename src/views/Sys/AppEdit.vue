<template>
  <div class="panel">
    <header class="panel-heading">新增修改App信息</header>
    <section>
      <el-form ref="form" label-width="200px" class="form">
        <el-form-item label="系统类型" prop="">
          <el-select v-model="AppType" placeholder="请选择">
            <el-option
              v-for="item in jy"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="">
          <el-input v-model="Version"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="">
          <el-input v-model="LinkUrl"></el-input>
        </el-form-item>
        <el-form-item label="版本说明" prop="">
          <el-input v-model="Comments"></el-input>
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
  import country from "@/views/Member/country";
  import { quillEditor } from 'vue-quill-editor'
  export default {
    data(){
      return {
        AppType: '',
        Version: '',
        LinkUrl:'',
        Comments:'',
        jy: [{
          value: 'Android',
          label: 'Android'
        },{
          value: 'IOS',
          label: 'IOS'
        }],
      }

    },
    created(){
    },
    mounted(){
      this.UserID = this.$route.query.id;
      this.options = country.getData();
      this.getDetails();
    },
    methods: {
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "User/GetBasicInfoById/{id}?id=" + this.UserID,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let data = res.data.Data;
              this.AppType = data.AppType;
              this.Version = data.Version;
              this.LinkUrl = data.LinkUrl
              this.Comments = data.Comments;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        var self = this;
        if (!self.LoginPwd) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '登录密码不能为空！',
            type: 'error'
          });
          return false;
        }
        if (!self.SafePwd) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '资金密码不能为空！',
            type: 'error'
          });
          return false;
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "User/DoBasicAddOrEdit",
            data: {
              'UserID': this.UserID,
              'FullName': this.FullName,
              'AreaCode': this.value,
              'LoginPwd': this.LoginPwd,
              'SafePwd': this.SafePwd,
              'ReferralCode': this.ReferralCode,
              'IsEnableTrade': this.jyValue,
              'IsEnableWithdraw': this.txValue,
              'Comments': this.Comments,
            }
          };
          this.$axios(config).then(result => {
            if (result.data.Status) {
              self.$message({
                type: "success",
                message: "提交成功!",
                onClose: () => {
                  this.$router.back(-1)
                }
              });
            } else {
              self.$message({
                type: "error",
                message: result.data.Msg,
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
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
  .form {
    margin-top: 30px;
    padding-bottom: 30px;
    margin-left: 100px;
  }

  /deep/ .el-input {
    width: 460px;
  }
</style>
