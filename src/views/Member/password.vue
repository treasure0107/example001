<template>
  <div class="panel">
    <header class="panel-heading">
      修改密码
    </header>
    <div class="con">
      <div class="block lb" style="padding: 10px 0;">
        原密码：<el-input type="password" v-model="OldPwd" placeholder="请输入内容"></el-input>
        新密码：<el-input type="password" v-model="NewPwd" placeholder="请输入内容"></el-input>
        重复密码：<el-input type="password" v-model="NewPwd2" placeholder="请输入内容"></el-input>
        <div style="margin-left: 38%">
          <el-button type="danger" @click="handle">确认</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import {baseUrl} from "@/config/env";
    export default {
        data(){
            return {
              OldPwd:'',
              NewPwd: '',
              NewPwd2: '',
            }

        },
        mounted(){

        },
        methods: {
          handle (){
            let self = this;
            if (!self.OldPwd) {
              this.$message({
                showClose: true,
                duration: 4000,
                message: '原密码不能为空！',
                type: 'error'
              });
              return false;
            }
            if (!self.NewPwd) {
              this.$message({
                showClose: true,
                duration: 4000,
                message: '新密码不能为空！',
                type: 'error'
              });
              return false;
            }
            if (!self.NewPwd2) {
              this.$message({
                showClose: true,
                duration: 4000,
                message: '重复密码不能为空！',
                type: 'error'
              });
              return false;
            }
            if (self.NewPwd != self.NewPwd2) {
              this.$message({
                showClose: true,
                duration: 4000,
                message: '重复密码要与新密码一样！',
                type: 'error'
              });
              return false;
            }
            this.$axios({
              method: "post",
              url: baseUrl + 'SysApi/DoChangePwd?r=' + Math.random(),
              data: {
                'NewPwd': self.NewPwd,
                'OldPwd': self.OldPwd,
                'NewPwd2': self.NewPwd2,
              }
            }).then((result) => {
              if (result.data.Status) {
                self.$message({
                  type: "success",
                  message: "修改成功!",
                  onClose: () => {
                    this.$store.dispatch('LogOut').then(res => {
                      this.$router.push('/Login')
                    },res=>{
                      console.log(res);
                    })
                  }
                });
              } else {
                self.$message({
                  type: "error",
                  message: result.data.Msg
                });
              }
            });
          },
          reset () {
            this.OldPwd = '';
            this.NewPwd = '';
            this.NewPwd2 = '';
          }
        },
        components: {}
    }

</script>

<style lang="scss" scoped>
  .con {
    height: 500px;
    font-size: 16px;
  }
  .el-input {
    margin-bottom: 20px;
    margin-top: 5px;
    width: 50%;
    display: block;
  }
  .block {
    margin-left: 50px;

  }
</style>
