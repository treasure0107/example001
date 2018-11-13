<template>
    <div class="warp">
      <div class="warp-div">
        <div class="div1">
          <img src="../../assets/Cbg.jpg" alt="" style="width: 100%;height: 100%">
        </div>
        <div class="div2">
          <div style="margin-top: 180px;">
            <h3>后台管理登录</h3>
            <el-form style="margin-left: 120px; margin-top: 20px">
              <el-form-item label="账号">
                <el-input v-model="username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="passWord" @keyup.enter.native="submitForm()"></el-input>
              </el-form-item>
              <!--<el-form-item label="图形验证码">-->
                <!--<el-input v-model="ImgCode" class="txt-code" name="ImgCode" style="width: 100px;"></el-input>-->
                <!--<img :src="SigCodeUrl" alt="code" class="img-code" id="ImgCode" @click="getCodeImg"/>-->
              <!--</el-form-item>-->
              <el-form-item class="mt-40">
                <el-button type="primary" class="w35 mr-20" style="width: 250px" @click="submitForm()">登录</el-button>
                <!--<el-button style="margin-top: 10px;float: right;margin-right: 20px;" type="text" @click="forgetPassWord">忘记密码？</el-button>-->
              </el-form-item>
            </el-form>
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
              username: '',
              passWord: '',
              ImgCode: ''
            }
        },
        mounted(){},
        methods: {
          formValidate()
          {
            if (!this.username) {
              this.$message({
                showClose: true,
                duration: 4000,
                message: '账号名称不能为空！',
                type: 'error'
              });
              return false;
            }
            if (!this.passWord) {
              this.$message({
                showClose: true,
                duration: 4000,
                message: '密码不能为空！',
                type: 'error'
              });
              return false;
            }
            return true;
          },
          //提交表单
          submitForm()
          {
            try {
              if (this.formValidate()) {
                let formData = {
                  "userName": this.username, //账户
                  "pwd": this.passWord,//登录密码
                };
								this.$store.dispatch('Login', formData).then(res => {
                  window.localStorage.setItem('MenuList',JSON.stringify(res.Data.MenuList));   //菜单栏
                  window.localStorage.setItem('UserInfo',JSON.stringify(res.Data.UserInfo));   //菜单栏
                  window.localStorage.setItem('RoleMenuList',JSON.stringify(res.Data.RoleMenuList));   //权限
                  this.$message({
										type: "success",
										duration: 1000,
										message: res.Msg || "登录成功！",
										onClose: () => {
											if (window.sessionStorage) {
												/* window.sessionStorage.setItem("UserInfo", JSON.stringify(res["Data"].UserInfo));
												window.sessionStorage.setItem("Token", 'bearer ' + res["Data"].Token); */
												this.$router.push('/')
											}
										}
									});
								},res=>{
									console.log(res);
								})

                /* this.$axios({
                  method: "post",
                  url: baseUrl + 'SysApi/Login?r=' + Math.random(),
                  data: formData
                }).then((result) => {
                  let res = result["data"];
                  if (res.ErrorCode == -1) {
                    this.$message({
                      type: "error",
                      duration: 1000,
                      message: res.Msg
                    });
                  } else {
                    this.$message({
                      type: "success",
                      duration: 1000,
                      message: res.Msg || "登录成功！",
                      onClose: () => {
                        if (window.sessionStorage) {
                          window.sessionStorage.setItem("UserInfo", JSON.stringify(res["Data"].UserInfo));
                          window.sessionStorage.setItem("Token", 'bearer ' + res["Data"].Token);
                          this.$router.push('/')
                        }
                      }
                    });
                  }
                }); */
              }
            } catch (ex) {
              until.consoleLog(ex);
            }
          }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
  .warp {
    background: url('../../assets/Lbg.jpg') center center no-repeat;
    position: absolute;
    top:0;
    bottom:0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .warp-div {
    position: absolute;
    top:0;
    bottom:0;
    left: 0;
    right: 0;
    width: 1000px;
    height: 600px;
    margin: auto;
  }
  .div1,.div2 {
    width: 500px;
    height: 600px;
    float: left;
  }
  .div2 {
    background: #f1f1f1;
  }
  h3 {
    text-align: center;
    font-size: 20px;
    color:#1680E3;
  }
  .el-input {
    width: 200px;
  }
</style>
