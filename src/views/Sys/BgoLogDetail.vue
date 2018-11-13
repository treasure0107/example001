<template>
    <div class="panel">
			<header class="panel-heading">
				后台操作记录详情
			</header>
      <el-form ref="form" :model="form" label-width="200px" class="form">

				<el-form-item label="菜单名称:" prop="Menu">
					<p v-text="form.Menu"></p>
				</el-form-item>
				<el-form-item label="类型:" prop="Type">
					<p v-text="form.TypeName"></p>
				</el-form-item>
				<el-form-item label="后台管理员:" prop="UserName">
					<p v-text="form.UserName"></p>
				</el-form-item>
				<el-form-item label="内容:" prop="Content">
					<p v-text="form.Content">
					</p>
				</el-form-item>
        <el-form-item label="日期:" prop="CreateTime">
          <p v-text="form.CreateTime"></p>
        </el-form-item>
			</el-form>
    </div>
</template>
<script type="text/babel">
		import until from '@/scripts/until';
    export default {
        data(){
          return {
            id:'',
						form:{
							"Menu": "",
							"TypeName": "",
							"UserName": "",
							"Content": "",
							"CreateTime": ""
						},
						SiteLogoUrlShow:"",
						SiteLogoUrlEnShow:"",
						url:this.$config.url,
						header: {Authorization: sessionStorage.getItem('Token')},
						uploadPath:this.$config.url+'/SysApi/ImgUpload',

					}
        },
      created(){
        this.id = this.$route.query.id;
      },
        mounted(){
					this.init();
        },
        methods: {
					/* 初始化 */
					init(){
						this.$axios({
							method: "get",
							url: this.$config.url + '/BGOLog/GetBgoLog?id='+ this.id
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
					}
				},
        components: {}
    }

</script>

<style lang="scss" scoped>
	.form{margin-left: 0px;padding: 10px 0;width: 800px;}
	.input-des{line-height: 20px;height: 20px;margin-bottom: 5px;font-size: 12px;}
  .panel { min-height: 800px!important;}
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
