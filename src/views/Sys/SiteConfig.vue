<template>
    <div class="panel">
			<header class="panel-heading">
				网站配置
			</header>
      <el-form ref="form" :model="form" label-width="200px" class="form">
				<el-form-item label="公司名称" prop="CorpName">
					<el-input v-model="form.CorpName"></el-input><div class="input-des">中文公司名称</div>
				</el-form-item>
				<el-form-item label="" prop="CorpNameEn" style="margin-top: -22px;">
					<el-input v-model="form.CorpNameEn"></el-input><div class="input-des">英文公司名称</div>
				</el-form-item>
				<el-form-item label="网站名称" prop="SiteName">
					<el-input v-model="form.SiteName"></el-input><div class="input-des">中文网站名称</div>
				</el-form-item>
				<el-form-item label="" prop="SiteNameEn" style="margin-top: -22px;">
					<el-input v-model="form.SiteNameEn"></el-input><div class="input-des">英文网站名称</div>
				</el-form-item>
				<el-form-item label="网站网址" prop="SiteUrl">
					<el-input v-model="form.SiteUrl"></el-input>
				</el-form-item>
				<el-form-item label="网站标题" prop="SiteTitle">
					<el-input v-model="form.SiteTitle"></el-input><div class="input-des">中文网站标题</div>
				</el-form-item>
				<el-form-item label="" prop="SiteTitleEn" style="margin-top: -22px;">
					<el-input v-model="form.SiteTitleEn"></el-input><div class="input-des">英文网站标题</div>
				</el-form-item>
				<el-form-item label="网站Logo" prop="SiteLogoUrl">
					<el-upload
						class="avatar-uploader upload"
						:action="uploadPath"
						:headers="header"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
						<img v-if="form.SiteLogoUrl" :src="SiteLogoUrlShow" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon">点击上传</i>
					</el-upload>
					<div class="input-des">请先设置网站网址提交后再上传网站Logo，上传网站Logo，建议尺寸200*50，大小不能超过600kb</div>
				</el-form-item>
				<el-form-item label="" prop="SiteLogoUrlEn" style="margin-top: -22px;">
					<el-upload
						class="avatar-uploader upload"
						:action="uploadPath"
						:headers="header"
						:show-file-list="false"
						:on-success="handleAvatarSuccessEn"
						:before-upload="beforeAvatarUpload">
						<img v-if="form.SiteLogoUrlEn" :src="SiteLogoUrlEnShow" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon">点击上传</i>
					</el-upload>
					<div class="input-des">请先设置网站网址提交后再上传网站Logo，上传网站Logo英文，建议尺寸200*50，大小不能超过600kb</div>
				</el-form-item>
				<el-form-item label="网站关键字" prop="KeyWord">
					<el-input v-model="form.KeyWord"></el-input><div class="input-des">网站关键字，多个关键字以逗号分隔</div>
				</el-form-item>
				<el-form-item label="" prop="KeyWordEn" style="margin-top: -22px;">
					<el-input v-model="form.KeyWordEn"></el-input><div class="input-des">网站关键字英文，多个关键字以逗号分隔</div>
				</el-form-item>
				<el-form-item label="网站描述" prop="SiteDescription">
					<el-input v-model="form.SiteDescription"></el-input><div class="input-des">网站描述，简单介绍平台信息</div>
				</el-form-item>
				<el-form-item label="" prop="SiteDescriptionEn" style="margin-top: -22px;">
					<el-input v-model="form.SiteDescriptionEn"></el-input><div class="input-des">网站描述英文，简单介绍平台信息</div>
				</el-form-item>
				<el-form-item label="CDN地址" prop="CdnUrl">
					<el-input v-model="form.CdnUrl"></el-input>
				</el-form-item>
				<el-form-item label="统计代码" prop="PageCountCode">
					<el-input
						type="textarea"
						:rows="5"
						v-model="form.PageCountCode">
					</el-input>
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
							CorpName: "",
							CorpNameEn: "",
							SiteName: "",
							SiteNameEn: "",
							SiteUrl: "",
							SiteTitle: "",
							SiteTitleEn: "",
							SiteLogoUrl: "",
							SiteLogoUrlEn: "",
							KeyWord: "",
							KeyWordEn: "",
							SiteDescription: "",
							SiteDescriptionEn: "",
							CdnUrl: "",
							PageCountCode: ""
						},
						SiteLogoUrlShow:"",
						SiteLogoUrlEnShow:"",
						url:this.$config.url,
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
							url: this.$config.url + '/SysApi/GetSiteConfig'
						}).then((result) => {
							if (until.responesValidate(result)) {
								let res = result["data"]["Data"];
								this.form=res;
								this.SiteLogoUrlShow=this.form.CdnUrl+this.form.SiteLogoUrl;
								this.SiteLogoUrlEnShow=this.form.CdnUrl+this.form.SiteLogoUrlEn;
								this.$nextTick(function() {
									window.scrollTo(0,0);
								});
							}
						});
					},
					submitForm(){
						this.$axios({
							method: "post",
							url: this.$config.url + '/SysApi/EditSiteConfig',
							data:this.form
						}).then((result) => {
							console.log(result);
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
							this.form.SiteLogoUrl=res.Data.SavePath;
							this.SiteLogoUrlShow=URL.createObjectURL(file.raw);
						}
					},
					handleAvatarSuccessEn(res, file) {
						//this.CardInfoUrlShow=URL.createObjectURL(file.raw);
						if(until.responesValidate(res)){
							this.form.SiteLogoUrlEn=res.Data.SavePath;
							this.SiteLogoUrlEnShow=URL.createObjectURL(file.raw);
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
