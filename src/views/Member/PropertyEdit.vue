<template>
  <div class="panel">
    <header class="panel-heading">修改资产信息</header>
    <section>
      <el-form ref="form" label-width="200px" class="form">
        <el-form-item label="用户编码" prop="">
          <el-input v-model="UserID" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="">
          <el-input v-model="FullName" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="" >
          <el-input v-model="PhoneNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="" >
          <el-input v-model="Email" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="">
          <!--<el-input v-text="CurrencyName + '[' + Unit + ']'" disabled></el-input>-->
          <el-input v-model="CurrencyUnit" disabled></el-input>
        </el-form-item>
        <el-form-item label="资产总额" prop="">
          <el-input v-model="Balance"></el-input>
        </el-form-item>
        <el-form-item label="可用余额" prop="">
          <el-input v-model="Available"></el-input>
        </el-form-item>
        <el-form-item label="冻结余额" prop="">
          <el-input v-model="Frozen"></el-input>
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
        UserID: '',
        FullName: '',
        CurrencyName:'',
        PhoneNumber:'',
        Email: '',
        Balance: '',
        Available: '',
        Frozen: '',
        moneyAmount: '',
        Unit: '',
        CurrencyUnit: ''
      }

    },
    created(){
    },
    mounted(){
      this.ID = this.$route.query.id;
      this.options = country.getData();
      this.getDetails();
    },
    methods: {
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "User/GetAssetInfoById/" + this.ID,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let data = res.data.Data;
              this.UserID = data.UserID;
              this.FullName = data.FullName;
              this.PhoneNumber = data.PhoneNumber;
              this.CurrencyName = data.CurrencyName
              this.Email = data.Email;
              this.Balance = data.Balance;
              this.Available = data.Available;
              this.Frozen = data.Frozen;
              this.moneyAmount = data.moneyAmount;
              this.CurrencyUnit = data.CurrencyName + '[' + data.Unit + ']';
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        var self = this;
        if (!self.Balance) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '资产总额不能为空！',
            type: 'error'
          });
          return false;
        }
        if (!self.Available) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '可用余额不能为空！',
            type: 'error'
          });
          return false;
        }
        if (!self.Frozen) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '冻结额度不能为空！',
            type: 'error'
          });
          return false;
        }
        if (self.Balance < 0) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '资产总额不能为负数！',
            type: 'error'
          });
          return false;
        }
        if (self.Available < 0) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '可用余额不能为负数！',
            type: 'error'
          });
          return false;
        }
        if (self.Frozen>0) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '冻结额度不能为负数！',
            type: 'error'
          });
          return false;
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "User/DoAssetEdit",
            data: {
              'AssetId': this.ID,
              'Balance': this.Balance,
              'Available': this.Available,
              'Frozen': this.Frozen,
            }
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
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
