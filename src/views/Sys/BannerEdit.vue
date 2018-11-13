<template>
  <div class="panel">
    <header class="panel-heading">{{tit}}Banner信息</header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="标题" prop="">
          <el-input v-model="form.Title"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="">
          <el-input v-model="form.LinkUrl"></el-input>
        </el-form-item>
        <el-form-item label="排序编号" prop="">
          <el-input type="Number" v-model="form.OrderByNo"></el-input>
        </el-form-item>
        <el-form-item label="图片上传" prop="ServiceWechatWp">
          <el-upload
            class="avatar-uploader upload"
            :action="uploadPath"
            :headers="header"
            :show-file-list="false"
            :on-success="handleAvatarSuccessGzh"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.ImgUrl" :src="ImgUrlShow" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon">点击上传</i>
          </el-upload>
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
        form:{
          "Title": "",
          "LinkUrl": "",
          "ImgUrl": "",
          "OrderByNo": "",
        },
        tit: '',
        id: '',
        ImgUrlShow:"",
        header: {Authorization: sessionStorage.getItem('Token')},
        uploadPath:this.$config.url+'/SysApi/ImgUpload',
      }

    },
    created(){
    },
    mounted(){
      this.id = this.$route.query.id;
      if (this.id != '0') {
        this.init();
        this.tit='修改'
      } else {
        this.tit = '新增'
        this.form.Title = '';
        this.form.LinkUrl = '';
        this.form.ImgUrl = '';
        this.form.OrderByNo = '';
      }
//      this.options = country.getData();
//      this.getDetails();
    },
    methods: {
      /* 初始化 */
      init(){
        this.$axios({
          method: "get",
          url: this.$config.url + 'Banners/GetBannersById/' + this.id
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result["data"]["Data"];
            this.form=res;
            this.ImgUrlShow=res.ImgLinkUrl;
            this.$nextTick(function() {
              window.scrollTo(0,0);
            });
          }
        });
      },
      handleAvatarSuccessGzh(res, file) {
        //this.CardInfoUrlShow=URL.createObjectURL(file.raw);
        this.form.ImgUrl=res.Data.SavePath;
//        this.ServiceWechatWpShow=res.Data.SavePath;
        this.ImgUrlShow=URL.createObjectURL(file.raw);
//        this.ImgUrlShow=res.Data.ShowPath;
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg')||(file.type === 'image/png');
        const isLt600kb = file.size / 1024  < 1024;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG或PNG 格式!');
        }
        if (!isLt600kb) {
          this.$message.error('上传图片大小不能超过 600kb!');
        }
        return isJPG && isLt600kb;
      },
      submitForm(){
        var self = this;
        if (!self.form.Title) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '标题不能为空！',
            type: 'error'
          });
          return false;
        }
        if (!self.form.LinkUrl) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '链接路径不能为空！',
            type: 'error'
          });
          return false;
        }
        if (!self.form.ImgUrl) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '图片不能为空！',
            type: 'error'
          });
          return false;
        }
        this.$axios({
          method: "post",
          url: this.$config.url + 'Banners/AddOrUpdateBanner',
          data:this.form
        }).then((result) => {
          if (until.responesValidate(result)) {
            this.$message({
              message: "操作成功",
              type: "success",
              onClose: function () {
                self.$router.back(-1)
              }
            });
          }
        });
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
