<template>
	<div class="panel">
		<header class="panel-heading">
			短信邮件模板配置
		</header>
		<el-form ref="form" :model="form" label-width="200px" class="form">
			<el-form-item label="短信邮件签名" prop="Signature">
				<el-input v-model="form.Signature"></el-input><div class="input-des">短信邮件签名</div>
			</el-form-item>
			<el-form-item label="" prop="Signature_EN" style="margin-top: -22px;">
				<el-input v-model="form.Signature_EN"></el-input><div class="input-des">短信邮件签名英文</div>
			</el-form-item>

			<el-form-item label="验证码标题" prop="VerifyCodeTitle">
				<el-input v-model="form.VerifyCodeTitle"></el-input><div class="input-des">验证码标题</div>
			</el-form-item>
			<el-form-item label="" prop="VerifyCodeTitle_EN" style="margin-top: -22px;">
				<el-input v-model="form.VerifyCodeTitle_EN"></el-input><div class="input-des">验证码标题英文</div>
			</el-form-item>

			<el-form-item label="验证码内容模板" prop="VerifyCodeTPL">
				<quill-editor v-model="form.VerifyCodeTPL" ref="VerifyCodeTPL"
						 :options="editorOption"
						 @blur="onEditorBlur($event)"
						 @focus="onEditorFocus($event)"
						 @change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">验证码模板内容模板，变量说明：{0}=验证码</div>
			</el-form-item>

			<el-form-item label="验证码内容模板英文" prop="VerifyCodeTPL_EN">
				<quill-editor v-model="form.VerifyCodeTPL_EN" ref="VerifyCodeTPL_EN"
						 :options="editorOption"
						 @blur="onEditorBlur($event)"
						 @focus="onEditorFocus($event)"
						 @change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">验证码模板内容模板英文，变量说明：{0}=验证码</div>
			</el-form-item>

			<el-form-item label="登录提醒标题" prop="LoginAlertTitle">
				<el-input v-model="form.LoginAlertTitle"></el-input><div class="input-des">登录提醒标题</div>
			</el-form-item>
			<el-form-item label="" prop="LoginAlertTitle_EN" style="margin-top: -22px;">
				<el-input v-model="form.LoginAlertTitle_EN"></el-input><div class="input-des">登录提醒标题英文</div>
			</el-form-item>

			<el-form-item label="登录提醒内容模板" prop="LoginAlertTPL">
				<quill-editor v-model="form.LoginAlertTPL" ref="LoginAlertTPL"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">登录提醒模板内容模板，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item label="登录提醒内容模板英文" prop="LoginAlertTPL_EN">
				<quill-editor v-model="form.LoginAlertTPL_EN" ref="LoginAlertTPL_EN"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">登录提醒模板内容模板，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item label="异地登录提醒标题" prop="OffsiteLoginAlertTitle">
				<el-input v-model="form.OffsiteLoginAlertTitle"></el-input><div class="input-des">异地登录提醒标题</div>
			</el-form-item>
			<el-form-item label="" prop="OffsiteLoginAlertTitle_EN" style="margin-top: -22px;">
				<el-input v-model="form.OffsiteLoginAlertTitle_EN"></el-input><div class="input-des">异地登录提醒标题英文</div>
			</el-form-item>

			<el-form-item label="异地登录提醒内容模板" prop="OffsiteLoginAlertTPL">
				<quill-editor v-model="form.OffsiteLoginAlertTPL" ref="OffsiteLoginAlertTPL"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">异地登录提醒内容模板，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item label="异地登录提醒内容模板英文" prop="OffsiteLoginAlertTPL_EN">
				<quill-editor v-model="form.OffsiteLoginAlertTPL_EN" ref="OffsiteLoginAlertTPL_EN"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">异地登录提醒内容模板英文，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item label="安全设置提醒标题" prop="SecurityAlertTitle">
				<el-input v-model="form.SecurityAlertTitle"></el-input><div class="input-des">安全设置提醒标题</div>
			</el-form-item>
			<el-form-item label="" prop="SecurityAlertTitle_EN" style="margin-top: -22px;">
				<el-input v-model="form.SecurityAlertTitle_EN"></el-input><div class="input-des">安全设置提醒标题英文</div>
			</el-form-item>

			<el-form-item label="安全设置提醒内容模板" prop="SecurityAlertTPL">
				<quill-editor v-model="form.SecurityAlertTPL" ref="SecurityAlertTPL"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">安全设置提醒内容模板，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item label="安全设置提醒内容模板英文" prop="OffsiteLoginAlertTPL_EN">
				<quill-editor v-model="form.OffsiteLoginAlertTPL_EN" ref="OffsiteLoginAlertTPL_EN"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">安全设置提醒内容模板英文，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item label="充值提醒标题" prop="DepositAlertTitle">
				<el-input v-model="form.DepositAlertTitle"></el-input><div class="input-des">充值提醒标题</div>
			</el-form-item>
			<el-form-item label="" prop="DepositAlertTitle_EN" style="margin-top: -22px;">
				<el-input v-model="form.DepositAlertTitle_EN"></el-input><div class="input-des">充值提醒标题英文</div>
			</el-form-item>

			<el-form-item label="充值提醒内容模板" prop="DepositAlertTPL">
				<quill-editor v-model="form.DepositAlertTPL" ref="DepositAlertTPL"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">充值提醒内容模板，变量说明：{0}=日期，{1}=金额</div>
			</el-form-item>

			<el-form-item label="充值提醒内容模板英文" prop="DepositAlertTPL_EN">
				<quill-editor v-model="form.DepositAlertTPL_EN" ref="DepositAlertTPL_EN"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">充值提醒内容模板英文，变量说明：{0}=日期，{1}=金额</div>
			</el-form-item>

			<el-form-item label="提现提醒标题" prop="WithdrawAlertTitle">
				<el-input v-model="form.WithdrawAlertTitle"></el-input><div class="input-des">提现提醒标题</div>
			</el-form-item>
			<el-form-item label="" prop="WithdrawAlertTitle_EN" style="margin-top: -22px;">
				<el-input v-model="form.WithdrawAlertTitle_EN"></el-input><div class="input-des">提现提醒标题英文</div>
			</el-form-item>

			<el-form-item label="提现提醒内容模板" prop="WithdrawAlertTPL">
				<quill-editor v-model="form.WithdrawAlertTPL" ref="WithdrawAlertTPL"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">提现提醒内容模板，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item label="提现提醒内容模板英文" prop="WithdrawAlertTPL_EN">
				<quill-editor v-model="form.WithdrawAlertTPL_EN" ref="WithdrawAlertTPL_EN"
						:options="editorOption"
						@blur="onEditorBlur($event)"
						@focus="onEditorFocus($event)"
						@change="onEditorChange($event)">
				</quill-editor>
				<div class="input-des">提现提醒内容模板英文，变量说明：{0}=日期</div>
			</el-form-item>

			<el-form-item>
				<el-button v-dbClick native-type="button" type="primary" @click="submitForm">提交</el-button><el-button type="info" @click="resetForm('form')">重置</el-button>
			</el-form-item>
		</el-form>

		<!-- 图片上传组件辅助-->
		<el-upload
			class="avatar-uploader help"
			:action="uploadPath"
			:headers="header"
			name="img"
			:show-file-list="false"
			:on-success="uploadSuccess"
			:on-error="uploadError"
			:before-upload="beforeUpload">
		</el-upload>
	</div>
</template>
<script type="text/babel">
		import until from '@/scripts/until';
		import Vue from 'vue'
		import { quillEditor } from 'vue-quill-editor'

		// 工具栏配置
		const toolbarOptions = [
			['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			['blockquote', 'code-block'],

			[{'header': 1}, {'header': 2}],               // custom button values
			[{'list': 'ordered'}, {'list': 'bullet'}],
			[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
			[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
			[{'direction': 'rtl'}],                         // text direction

			[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
			[{'header': [1, 2, 3, 4, 5, 6, false]}],         // dropdown with defaults from theme
			[{'font': []}],
			[{'align': []}],
			['link', 'image', 'video'],
			['clean']                                         // remove formatting button
		]
		let currentQuill=null;
    export default {
        data(){
          return {
						form:{
							Signature: "",
							VerifyCodeTitle: "",
							VerifyCodeTPL: "",
							LoginAlertTitle: "",
							LoginAlertTPL: "",
							OffsiteLoginAlertTitle: "",
							OffsiteLoginAlertTPL: "",
							SecurityAlertTitle: "",
							SecurityAlertTPL: "",
							DepositAlertTitle: "",
							DepositAlertTPL: "",
							WithdrawAlertTitle: "",
							WithdrawAlertTPL: "",
							Signature_EN: "",
							VerifyCodeTitle_EN: "",
							VerifyCodeTPL_EN: "",
							LoginAlertTitle_EN: "",
							LoginAlertTPL_EN: "",
							OffsiteLoginAlertTitle_EN: "",
							OffsiteLoginAlertTPL_EN: "",
							SecurityAlertTitle_EN: "",
							SecurityAlertTPL_EN: "",
							DepositAlertTitle_EN: "",
							DepositAlertTPL_EN: "",
							WithdrawAlertTitle_EN: "",
							WithdrawAlertTPL_EN: ""
						},
						uploadPath:this.$config.url+'/SysApi/ImgUpload',
						header: {Authorization: sessionStorage.getItem('Token')},
						editorOption: {
								placeholder: '',
								theme: 'snow',  // or 'bubble'
								modules: {
										toolbar: {
												container: toolbarOptions,  // 工具栏
												handlers: {
														'image': function (value) {
															if (value) {
																currentQuill=this.quill;
																document.querySelector('.avatar-uploader.help input').click()
															} else {
																this.quill.format('image', false);
															}
													}
												}
										}
								}
						}
					}
        },
        mounted(){
					this.init();
        },
        methods: {
					/* 初始化 */
					init(){
						this.$axios({
							method: "get",
							url: this.$config.url + '/SysApi/GetSMSEmailTPLConfig'
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
							url: this.$config.url + '/SysApi/DoSMSEmailTPLConfig',
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
					onEditorBlur(editor){//失去焦点事件
					},
					onEditorFocus(editor){//获得焦点事件
					},
					onEditorChange({editor,html,text}){//编辑器文本发生变化
						//this.content可以实时获取到当前编辑器内的文本内容
					},
					// 富文本图片上传前
					beforeUpload() {
						// 显示loading动画
						this.quillUpdateImg = true
					},
					uploadSuccess(res, file) {
						// res为图片服务器返回的数据
						// 获取富文本组件实例
						let quill = currentQuill;
						console.log(res);
						// 如果上传成功
						if (res.Status === true && res.Data !== null) {
								// 获取光标所在位置
								let length = quill.getSelection().index;
								// 插入图片  res.info为服务器返回的图片地址
								quill.insertEmbed(length, 'image', res.Data.ShowPath)
								// 调整光标到最后
								quill.setSelection(length + 1)
						} else {
								this.$message.error('图片插入失败')
						}
						// loading动画消失
						this.quillUpdateImg = false
					},
					// 富文本图片上传失败
					uploadError() {
							// loading动画消失
							this.quillUpdateImg = false
							this.$message.error('图片插入失败')
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
