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

          <button @click="getUEContent()">获取内容</button>
          <button @click="getUEContentTxt()">获取无文本内容</button>
          <div class="editor-container">
            <UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue1"></UE>
            <UE :defaultMsg=defaultMsg :config=config :id=ue2 ref="ue2"></UE>
          </div>
        </el-form-item>
        <el-form-item style="width: 65%" :label="tit + '英文内容'" prop="">

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
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import UE from '../../components/ue.vue';

  // 工具栏配置
  export default {
    components: {UE},
    data(){
      return {
        defaultMsg: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        },
        ue1: "ue1", // 不同编辑器必须不同的id
        ue2: "ue2",

        tit: '',
        title: '',
        DocTitle:'',
        DocTitle_EN: '',
        TypeID: '',
        VerifyCodeTPL: '',
        VerifyCodeTPL_EN: '',
        ID: '',
        isEdit: '',
        header: {Authorization: sessionStorage.getItem('Token')},
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
      getUEContent() {
        // 获取ueditor值
        let content1 = UE.getEditor(this.ue1).getContent();
        let content2 = UE.getEditor(this.ue2).getContent();
        console.log(content1);
        console.log(content2);
      },
      init(){
        this.$axios({
          method: "get",
          url: this.$config.url + '/SysApi/GetSiteConfig'
        }).then((result) => {
          if (until.responesValidate(result)) {
            let res = result["data"]["Data"];
            this.form=res;
            this.$nextTick(function() {
              // this.$refs.VerifyCodeTPL.quill.blur();
              // this.$refs.VerifyCodeTPL_EN.quill.blur();
            });
          }
        });
      },
      getDetails(){

         const _this = this;
         this.editor = UE.getEditor(this.ue1); // 初始化UE
        //  this.editor.addListener("ready", function () {
        // //   _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
        // });

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
                  _this.editor.setContent(data.DocContent); // 确保UE加载完成后，放入内容。
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
                _this.editor.setContent(data.DocContent); // 确保UE加载完成后，放入内容。
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
      }
    },
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
  .info{
    border-radius: 10px;
    line-height: 20px;
    padding: 10px;
    margin: 10px;
    background-color: #ffffff;
  }

  .el-form-item__content{
    line-height:20px!important;
  }
</style>
