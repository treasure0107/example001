<template>
    <div class="panel">
			<header class="panel-heading">
				短信接口配置
			</header>
      <el-form ref="form1" :model="form" label-width="200px" class="form">
				<el-form-item label="短信接口API" prop="SMSApiUrl">
					<el-input v-model="form.SMSApiUrl"></el-input><div class="input-des">短信接口API地址</div>
				</el-form-item>
				<el-form-item label="短信接口用户名" prop="SMSAccount">
					<el-input v-model="form.SMSAccount"></el-input><div class="input-des">短信接口用户名</div>
				</el-form-item>
				<el-form-item label="短信接口密码" prop="SMSPwd">
					<el-input type="password" auto-complete="new-password" v-model="form.SMSPwd"></el-input><div class="input-des">短信接口密码</div>
				</el-form-item>
				<el-form-item label="短信接口KEY" prop="SMSKey">
					<el-input v-model="form.SMSKey"></el-input><div class="input-des">短信接口KEY</div>
				</el-form-item>
			</el-form>

			<header class="panel-heading">
				邮件接口配置
			</header>
			<el-form ref="form2" :model="form" label-width="200px" class="form">
				<el-form-item label="邮件SMTP服务器地址" prop="MailServerUrl">
					<el-input v-model="form.MailServerUrl"></el-input><div class="input-des">邮件SMTP服务器地址，如：smtp.qq.com</div>
				</el-form-item>
				<el-form-item label="SMTP服务器端口" prop="MailPort">
					<el-input v-model="form.MailPort"></el-input><div class="input-des">SMTP服务器端口，如：587</div>
				</el-form-item>
				<el-form-item label="邮箱地址" prop="MailAccount">
					<el-input v-model="form.MailAccount"></el-input><div class="input-des">邮箱地址</div>
				</el-form-item>
				<el-form-item label="邮箱密码" prop="MailPwd">
					<el-input type="password" auto-complete="new-password" v-model="form.MailPwd"></el-input><div class="input-des">邮箱密码</div>
				</el-form-item>
				<el-form-item>
					<el-button v-dbClick native-type="button" type="primary" @click="submitForm">提交</el-button><el-button type="info" @click="resetForm">重置</el-button>
				</el-form-item>
			</el-form>
    </div>
</template>
<script type="text/babel">
		import until from '@/scripts/until';
    export default {
        data(){
          return {
						form:{
							SMSApiUrl: "",
							SMSAccount: "",
							SMSPwd: "",
							SMSKey: "",
							MailServerUrl: "",
							MailPort: "",
							MailAccount: "",
							MailPwd: "",

						},
						uploadPath:this.$config.url+'/SysApi/ImgUpload',

					}
        },
        beforeRouteLeave(to, from, next) {
          from.meta.keepAlive = true;
          next();
        },
        mounted(){
					this.init();
        },
        methods: {
					/* 初始化 */
					init(){
						this.$axios({
							method: "get",
							url: this.$config.url + '/SysApi/GetSMSEmailConfig'
						}).then((result) => {
							if (until.responesValidate(result)) {
								let res = result["data"]["Data"];
								this.form=res;
								this.$nextTick(function() {
									window.scrollTo(0,0);
								});
							}
						});
					},
					submitForm(){
						this.$axios({
							method: "post",
							url: this.$config.url + '/SysApi/DoSMSEmailConfig',
							data:this.form
						}).then((result) => {
							if (until.responesValidate(result)) {
								this.$message({
									message: "修改成功",
									type: "success"
								});
							}
						});
					},
					resetForm(formName) {
						this.$refs['form1'].resetFields();
						this.$refs['form2'].resetFields();
					},
					//图片上传
					handleAvatarSuccess(res, file) {
						//this.CardInfoUrlShow=URL.createObjectURL(file.raw);
						this.form.ServiceWechat=res.Data.FileUrl;
					},
					handleAvatarSuccessGzh(res, file) {
						//this.CardInfoUrlShow=URL.createObjectURL(file.raw);
						this.form.ServiceWechatWp=res.Data.FileUrl;
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
				},
        components: {}
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
