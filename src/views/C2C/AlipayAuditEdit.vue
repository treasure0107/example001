<template>
  <div class="panel">
    <header class="panel-heading">编辑支付宝账号详情</header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="用户昵称">
          <el-input v-model="form.UserName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="form.TrueName"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号">
          <el-input v-model="form.AlipayAccount"></el-input>
        </el-form-item>
        <el-form-item label="账号绑定的手机号">
          <el-input v-model="form.Alipaymobile"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.Remark" maxlength="300"></el-input>
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
        id: 0,
        form: {
          UserName: "",
          TrueName: "",
          AlipayAccount: "",
          Alipaymobile: '',
          Remark: '',
        },
      }
    },
    mounted(){
      this.id = this.$route.query.id;
      this.getDetails();
    },
    methods: {
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "C2C/GetUserPaymentById/" + this.id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.form = res.data.Data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        try {
          let config = {
            method: "POST",
            url: baseUrl + "C2C/UpdateUserPaymentById",
            data:this.form
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.$message({
                type: "success",
                duration: 1000,
                message: res.data.msg || "操作成功！",
                onClose: () => {
                  this.$router.push('/AlipayAudit');
                }
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }

      }
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  .form {
    margin-top: 30px;
    padding-bottom: 30px;
  }

  /deep/ .el-input, .el-textarea {
    width: 400px;
  }

  /deep/ .el-textarea__inner {
    height: 300px;
  }
</style>
