<template>
  <div class="panel">
    <header class="panel-heading">{{tit}}管理</header>
    <section>
      <el-form ref="form" label-width="200px" class="form">
        <el-form-item :label="tit + '标题'" prop="">
          <el-input v-model="DocTitle"></el-input>
        </el-form-item>
        <el-form-item :label="tit + '英文标题'" prop="">
          <el-input v-model="DocTitle_EN"></el-input>
        </el-form-item>
        <el-form-item v-if="tit == '新闻公告'" :label="tit + '类型'" prop="">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="tit + '内容'" prop="">
          <quill-editor style="width: 60%" v-model="VerifyCodeTPL" ref="VerifyCodeTPL"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>
        <el-form-item style="width: 65%" :label="tit + '英文内容'" prop="">
          <quill-editor v-model="VerifyCodeTPL_EN" ref="VerifyCodeTPL_EN"
                        :options="editorOption"
                        @blur="onEditorBlur2($event)"
                        @focus="onEditorFocus2($event)"
                        @change="onEditorChange2($event)">
          </quill-editor>
        </el-form-item>
        <el-form-item v-if="tit == '新闻公告'" :label="tit + '创建时间'" >
          <div class="block">
            <el-date-picker
              v-model="CreateTime"
              style="width: 200px;"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </section>
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
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import { quillEditor } from 'vue-quill-editor';

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
        tit: '',
        title: '',
        DocTitle:'',
        DocTitle_EN: '',
        TypeID: '',
        VerifyCodeTPL: '',
        VerifyCodeTPL_EN: '',
        editorOption: {
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],

              [{'header': 1}, {'header': 2}],               // custom button values
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
              [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
              [{'direction': 'rtl'}],                         // text direction

              [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
              [{'header': [1, 2, 3, 4, 5, 6, false]}], // dropdown with defaults from theme
              [{'font': []}],
              [{'align': []}],
              ['link', 'image', 'video'],
              ['clean']                                         // remove formatting button
            ]
          }
        },
        ID: '',
        isEdit: '',
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
        },
        CreateTime: '',
        options: [{
          value: 1,
          label: '新闻资讯'
        },{
          value: 2,
          label: '平台公告'
        }],
        value:''
      }

    },
    created(){
    },
    mounted(){
      this.init();
      let title = this.$route.query.isEdit;
      this.isEdit = this.$route.query.isEdit;
      if(this.$route.query.id){
        this.ID = this.$route.query.id;
        this.getDetails();
        let date = new Date();
        this.CreateTime = until.formatDate(date);
      } else {
        this.ID = 0;
        this.DocTitle = '';
        this.DocTitle_EN = '';
        this.value = 1;
        this.VerifyCodeTPL = '';
        this.VerifyCodeTPL_EN = '';
        this.CreateTime = '';
      }
      if(title == 'News'){
        this.tit = '新闻公告'
      } else if (title == 'Int') {
        this.tit = '平台介绍'
      } else if (title == 'Hel') {
        this.tit = '新手指导'
      }
    },
    methods: {
      init(){
        this.$axios({
          method: "get",
          url: this.$config.url + '/SysApi/GetSiteConfig'
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result["data"]["Data"];
            this.form=res;
            this.$nextTick(function() {
              this.$refs.VerifyCodeTPL.quill.blur();
              this.$refs.VerifyCodeTPL_EN.quill.blur();
            });
          }
        });
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
      },
      getDetails(){
        if (this.isEdit == 'News') {
          try {
            let config = {
              method: "GET",
              url: baseUrl + "Document/GetNewsById?id=" + this.ID,
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                let data = res.data.Data;
                if (data) {
                  this.DocTitle = data.DocTitle||'';
                  this.DocTitle_EN = data.DocTitle_EN;
                  this.VerifyCodeTPL = data.DocContent;
                  this.VerifyCodeTPL_EN = data.DocContent_EN;
//                this.CreateTime = data.CreateTime;
                  this.value = data.TypeID
                }
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
        } else {
          try {
            let config = {
              method: "GET",
              url: baseUrl + "Document/GetDocumentByID?id=" + this.ID,
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                let data = res.data.Data;
                this.DocTitle = data.DocTitle;
                this.DocTitle_EN = data.DocTitle_EN;
                this.VerifyCodeTPL = data.DocContent;
                this.VerifyCodeTPL_EN = data.DocContent_EN;
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
        }
      },
      submitForm(){
        var self = this;
        if (!self.DocTitle) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '标题不能为空！',
            type: 'error'
          });
          return false;
        }
        if (!self.VerifyCodeTPL) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '内容不能为空！',
            type: 'error'
          });
          return false;
        }
        if (this.isEdit == 'News') {
          try {
            if (!self.CreateTime) {
              this.$message({
                showClose: true,
                duration: 4000,
                message: '时间不能为空！',
                type: 'error'
              });
              return false;
            }
            let config = {
              method: "POST",
              url: baseUrl + "Document/EditNews",
              data: {
                'DocTitle': this.DocTitle,
                'DocTitle_EN': this.DocTitle_EN,
                'DocContent': this.VerifyCodeTPL,
                'DocContent_EN': this.VerifyCodeTPL_EN,
                'TypeID': this.value,
                'ID': this.ID,
                'CreateTime': this.CreateTime,
              }
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                if (result.data.Status) {
                  self.$message ({
                    type: "success",
                    message: "提交成功!",
                    onClose: () => {
                      this.$router.back (-1)
                    }
                  });
                }
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
        } else {
          try {
            let type;
            if (this.isEdit == '平台介绍') {
              type = 1
            } else {
              type = 2
            }
            let config = {
              method: "POST",
              url: baseUrl + "Document/AddOrEditDocument",
              data: {
                'DocTitle': this.DocTitle,
                'DocTitle_EN': this.DocTitle_EN,
                'DocContent': this.VerifyCodeTPL,
                'DocContent_EN': this.VerifyCodeTPL_EN,
                'TypeID': type,
                'ID': this.ID,
              }
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                if (result.data.Status) {
                  self.$message ({
                    type: "success",
                    message: "提交成功!",
                    onClose: () => {
                      this.$router.back (-1)
                    }
                  });
                }
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
        }
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
  .form {
    margin-top: 30px;
    padding-bottom: 30px;
    margin-left: 100px;
  }

  /deep/ .el-input {
    width: 460px;
  }
</style>
