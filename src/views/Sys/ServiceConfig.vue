<template>
    <div class="panel">
			<header class="panel-heading">
				客服配置
			</header>
      <el-form ref="form" :model="form" label-width="200px" class="form">
				<el-form-item label="客服电话" prop="ServiceTel">
					<el-input v-model="form.ServiceTel"></el-input><div class="input-des">客服电话，如：4000-888-888</div>
				</el-form-item>
				<el-form-item label="客服邮箱" prop="ServiceEmail">
					<el-input v-model="form.ServiceEmail"></el-input><div class="input-des">客服邮箱</div>
				</el-form-item>
				<el-form-item label="客服微信二维码" prop="ServiceWechat">
					<el-upload
						class="avatar-uploader upload"
						:action="uploadPath"
						:headers="header"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
						<img v-if="form.ServiceWechat" :src="ServiceWechatShow" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon">点击上传</i>
					</el-upload>
					<div class="input-des">请先设置网站网址提交后再上传微信二维码，点击修改上传客服微信二维码，大小不能超过600kb</div>
				</el-form-item>
				<el-form-item label="微信公众号二维码" prop="ServiceWechatWp">
					<el-upload
						class="avatar-uploader upload"
						:action="uploadPath"
						:headers="header"
						:show-file-list="false"
						:on-success="handleAvatarSuccessGzh"
						:before-upload="beforeAvatarUpload">
						<img v-if="form.ServiceWechatWp" :src="ServiceWechatWpShow" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon">点击上传</i>
					</el-upload>
					<div class="input-des">请先设置网站网址提交后再上传微信公众号二维码，点击修改上传微信公众号二维码，大小不能超过600kb</div>
				</el-form-item>
				<el-form-item label="客服QQ" prop="ServiceQQ">
					<el-input v-model="form.ServiceQQ"></el-input><div class="input-des">客服QQ</div>
				</el-form-item>
				<el-form-item label="官方QQ群" prop="ServiceQQGroup">
					<el-input v-model="form.ServiceQQGroup"></el-input><div class="input-des">官方QQ群</div>
				</el-form-item>
				<el-form-item label="客服代码" prop="ServiceQQGroup">
					<el-input v-model="form.CustomerServiceScript"></el-input><div class="input-des">客服代码</div>
				</el-form-item>
				<el-form-item>
					<el-button v-dbClick native-type="button" type="primary" @click="submitForm">提交</el-button><el-button type="info" @click="resetForm('form')">重置</el-button>
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
							ServiceTel: "",
							ServiceEmail: "",
							ServiceWechat: "",
							ServiceWechatWp: "",
							ServiceQQ: "",
							ServiceQQGroup: "",
							CDNUrl: "",
							CustomerServiceScript: ""
						},
						ServiceWechatShow:"",
						ServiceWechatWpShow:"",
						header: {Authorization: sessionStorage.getItem('Token')},
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
							url: this.$config.url + '/SysApi/GetServiceConfig'
						}).then((result) => {
							if (until.responesValidate(result)) {
								let res = result["data"]["Data"];
								this.form=res;
								this.ServiceWechatShow=this.form.CDNUrl+this.form.ServiceWechat;
								this.ServiceWechatWpShow=this.form.CDNUrl+this.form.ServiceWechatWp;
								this.$nextTick(function() {
									window.scrollTo(0,0);
								});
							}
						});
					},
					submitForm(){
						this.$axios({
							method: "post",
							url: this.$config.url + '/SysApi/DoServiceConfig',
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
						this.$refs[formName].resetFields();
					},
					//图片上传
					handleAvatarSuccess(res, file) {
						//this.CardInfoUrlShow=URL.createObjectURL(file.raw);
            if(until.responesValidate(res)){
              this.form.ServiceWechat=res.Data.SavePath;
              this.ServiceWechatShow=URL.createObjectURL(file.raw);
            }
					},
					handleAvatarSuccessGzh(res, file) {
						//this.CardInfoUrlShow=URL.createObjectURL(file.raw);
            if(until.responesValidate(res)){
              this.form.ServiceWechatWp=res.Data.SavePath;
              this.ServiceWechatWpShow=URL.createObjectURL(file.raw);
            }
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
