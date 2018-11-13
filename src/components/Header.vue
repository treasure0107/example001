<template>
 <div class="header">
   <div class="head">
     <div class="tooltips">
       <img src="@/assets/timg.jpg" alt="">
     </div>
     <a class="tit" href="javascript:void(0)">苹果数字资产交易平台 <span>后台管理系统</span></a>
     <!--<div class="right"><i class="fa fa-user"></i><span class="span1">超级管理员</span><span class="el-icon-caret-bottom"></span></div>-->
     <el-dropdown class="right" @command="handleCommand">
       <el-button type="primary" style="background: #fff; color:#333; border:none;font-size: 16px">
         <i class="fa fa-user"></i><span v-text="title.FullName"></span><i class="el-icon-arrow-down el-icon--right"></i>
       </el-button>
       <el-dropdown-menu slot="dropdown">
         <el-dropdown-item command="a"><i class="fa fa-key fa-fw"></i> 修改密码</el-dropdown-item>
         <el-dropdown-item command="b"><i class="fa fa-cog"></i> 注销</el-dropdown-item>
       </el-dropdown-menu>
     </el-dropdown>
   </div>
 </div>
</template>
<script type="text/babel">
  import {baseUrl} from "@/config/env";
  import until from '@/scripts/until';
    export default {
        data(){
            return {
              title: ''
            }

        },
        mounted(){
          this.title = JSON.parse(localStorage.getItem('UserInfo'))
        },
        methods: {
          handleCommand(command) {
            var self = this;
            if (command == 'a') {
              this.$router.push('/password');
            } else {
              /* this.$axios({
                method: "post",
                url: baseUrl + 'SysApi/Logout' ,
                data: ''
              }).then((result) => {
                if (until.responesValidate(result)) {
                  self.$message({
                    type: "success",
                    message: "注销成功!",
                    onClose: () => {
                      localStorage.removeItem("UserInfo");
                      self.$router.push('/Login');
                    }
                  });
                }
              }); */
							this.$store.dispatch('LogOut').then(res => {
								this.$message({
									type: "success",
									duration: 1000,
									message: res.Msg || "注销成功！",
									onClose: () => {
										if (window.sessionStorage) {
											this.$router.push('/Login')
                      localStorage.removeItem("UserInfo");
										}
									}
								});
							},res=>{
								console.log(res);
							})
            }
          }
        },
        components: {}
    }

</script>

<style lang="" scoped>
  .head {
    height: 60px;
    background: #fff;
  }
  .tooltips {
    margin-left: 20px;
    width: 40px;
    height: 40px;
    float: left;
    margin-top: 10px;
  }
  .tooltips img {
    width: 100%;
    height: 100%;
  }
  .tit {
    margin-left: 20px;
    float: left;
    font-size: 20px;
    height: 60px;
    line-height: 60px;
  }
  .tit span {
    color: red;
  }
  .span1 {
    font-size: 16px;
    margin-right: 10px;
  }
  .right {
    float: right;
    height: 60px;
    line-height: 60px;
    margin-right: 20px;
  }
  .el-icon-caret-bottom {
    font-size: 20px;
  }
  .fa-user {
    font-size: 20px;
    margin-right: 20px;
  }
  .log {
    width: 100px;
    position: absolute;
    top:60px;
    right: 50px;
    z-index: 999;
    text-align: center;
    background: #a9d96c;
  }
  .a1,.a2{
    display: block;
    width: 100px;
    height: 50px;
    line-height: 50px;
    color:#fff;
    font-size: 16px;
  }
  .a1 {
    border-bottom: 1px solid #f1f1f1;
  }
</style>
