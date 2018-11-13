<template>
  <div class="panel">
    <header class="panel-heading"><span v-if="!isShow">添加加密货币</span><span v-if="isShow">修改加密货币</span></header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="货币名称">
          <el-input v-model="form.CurrencyName"></el-input>
        </el-form-item>
        <el-form-item label="货币名称英文">
          <el-input v-model="form.CurrencyName_EN"></el-input>
        </el-form-item>

        <el-form-item label="货币图标">
          <el-upload
            class="avatar-uploader upload"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.IconUrl" :src="form.ShowIconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon">点击上传</i>
          </el-upload>
          <div class="input-des">请上传货币图标，大小不能超过600kb</div>
        </el-form-item>
        <el-form-item label="是否开启站内资金互转" prop="IsCanTransferAsset">
          <template>
            <el-radio-group v-model="form.IsCanTransferAsset">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="最小互转金额" v-if="form.IsCanTransferAsset==1">
          <el-input type="Number" v-model="form.TransferAssetMinAmount"></el-input>
        </el-form-item>
        <el-form-item label="最大互转金额" v-if="form.IsCanTransferAsset==1">
          <el-input type="Number" v-model="form.TransferAssetMaxAmount"></el-input>
        </el-form-item>
        <el-form-item label="互转资金起审额度" v-if="form.IsCanTransferAsset==1">
          <el-input type="Number" v-model="form.AuditTransferAssetAmount"></el-input>
        </el-form-item>
        <el-form-item label="货币类型">
          <el-select v-model="form.CurrencyTypeID" placeholder="货币类型" class="el-select-re">
            <el-option label="法币" value="1"></el-option>
            <el-option label="加密货币" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货币API类型">
          <el-select v-model="form.ApiTypeID" placeholder="货币API类型" class="el-select-re">
            <el-option label="BitCoin API" value="1"></el-option>
            <el-option label="ERC-20 API" value="2"></el-option>
            <el-option label="ETH API" value="3"></el-option>
            <el-option label="Omni API" value="4"></el-option>
            <el-option label="Currency API" value="5"></el-option>
            <el-option label="法币" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二维码前缀">
          <el-input v-model="form.QrCodePrefix"></el-input>
        </el-form-item>
        <el-form-item label="货币单位">
          <el-input v-model="form.Unit"></el-input>
        </el-form-item>
        <el-form-item label="货币符号">
          <el-input v-model="form.Symbol"></el-input>
        </el-form-item>
        <el-form-item label="钱包服务器IP">
          <el-input v-model="form.WalletIP"></el-input>
        </el-form-item>
        <el-form-item label="钱包服务器端口">
          <el-input v-model="form.WalletPort"></el-input>
        </el-form-item>
        <el-form-item label="钱包服务器用户名">
          <el-input v-model="form.WalletUserName"></el-input>
        </el-form-item>
        <el-form-item label="钱包服务器密码">
          <el-input v-model="form.WalletPassword"></el-input>
        </el-form-item>
        <el-form-item label="钱包加密密钥">
          <el-input v-model="form.WalletPassphrase"></el-input>
        </el-form-item>
        <el-form-item label="主钱包地址">
          <el-input v-model="form.MainBlockAddress"></el-input>
        </el-form-item>
        <el-form-item label="冷钱包地址">
          <el-input v-model="form.ColdBlockAddress"></el-input>
        </el-form-item>
        <el-form-item label="汇总最小值">
          <el-input v-model="form.MinAggregateAmount"></el-input>
        </el-form-item>
        <el-form-item label="合约地址">
          <el-input v-model="form.ContractAddress"></el-input>
        </el-form-item>
        <el-form-item label="合约精度">
          <el-input v-model="form.TokenDecimals"></el-input>
        </el-form-item>
        <el-form-item label="法币充值账户说明">
          <quill-editor v-model="form.DepositAccount" ref="DepositAccount"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>
        <el-form-item label="法币充值账户说明英文">
          <quill-editor v-model="form.DepositAccount_EN" ref="DepositAccount_EN"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>

        <el-form-item label="充值确认次数">
          <el-input v-model="form.ConfirmCount"></el-input>
        </el-form-item>
        <el-form-item label="小数点位数">
          <el-input v-model="form.DecimalDigits"></el-input>
        </el-form-item>
        <el-form-item label="充值提示">
          <quill-editor v-model="form.DepositTips" ref="DepositTips"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>
        <el-form-item label="充值提示英文">
          <quill-editor v-model="form.DepositTips_EN" ref="DepositTips_EN"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>
        <el-form-item label="提现提示">
          <quill-editor v-model="form.WithdrawTips" ref="WithdrawTips"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>
        <el-form-item label="提现提示英文">
          <quill-editor v-model="form.WithdrawTips_EN" ref="WithdrawTips_EN"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
          </quill-editor>
        </el-form-item>

        <el-form-item label="排序编号">
          <el-input v-model="form.OrderByNo"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.Comments"></el-input>
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
  import Vue from 'vue'
  import {quillEditor} from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
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
    [{'header': [1, 2, 3, 4, 5, 6, false]}], // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ]
  let currentQuill = null;
  export default {
    data(){
      return {
        id: '',
        isEdit: '',
        isShow: true,
        currencyList: [],
        marketTypeList: [],
        checkList: [],
        form: {
          CurrencyID: 0,
          CurrencyName: '',
          CurrencyName_EN: '',
          IconUrl: '',   //图片路径
          ShowIconUrl: '',   //图片路径(显示)
          CurrencyTypeID: '1',
          ApiTypeID: '1',
          QrCodePrefix: '',
          Unit: '',
          Symbol: '',
          WalletIP: '',
          WalletPort: '',
          WalletUserName: '',
          WalletPassword: '',
          WalletPassphrase: '',
          MainBlockAddress: '',
          ColdBlockAddress: '',
          MinAggregateAmount: '',
          ContractAddress: '',
          TokenDecimals: '',
          DepositAccount: '',
          DepositAccount_EN: '',
          ConfirmCount: '',
          DecimalDigits: '',
          DepositTips: '',
          DepositTips_EN: '',
          WithdrawTips: '',
          WithdrawTips_EN: '',
          OrderByNo: '',
          Comments: '',
          IsCanTransferAsset : '',
          TransferAssetMinAmount : '',
          TransferAssetMaxAmount : '',
          AuditTransferAssetAmount: '',
        },
        header: {Authorization: sessionStorage.getItem('Token')},
        uploadPath: this.$config.url + '/SysApi/ImgUpload',
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    currentQuill = this.quill;
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
    created(){
      this.isEdit = this.$route.query.isEdit;
      if (this.isEdit == 1) {
        this.id = this.$route.query.id;
//        this.form.CurrencyID = this.$route.query.id;
      }
    },
    mounted(){
      this.getQueryCurrencyPage();   //获取货币列表（用于下拉列表）
      this.getMarketTypeList();   //获取货币列表（用于下拉列表）
      if (this.isEdit == 1) {
        this.isShow = true;
        this.getDetails();
      } else {
        this.isShow = false;
      }
    },
    methods: {
      getQueryCurrencyPage(){   //获取货币列表
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/QueryCurrencyPage/",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let DataList = res.data.Data.DataList;
              this.currencyList = DataList
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getMarketTypeList(){   //获取货币列表
        try {
          let config = {
            method: "GET",
            url: baseUrl + "MarketType/MarketTypeList/",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let DataList = res.data.Data.DataList;
              this.marketTypeList = DataList
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/GetById/" + this.id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let data = res.data.Data;
              this.form = data;
              if (data.CurrencyTypeID) {
                this.form.CurrencyTypeID = data.CurrencyTypeID.toString();
              }
              if (data.IsCanTransferAsset == 1) {
                this.form.IsCanTransferAsset = data.IsCanTransferAsset.toString();
              } else {
                this.form.IsCanTransferAsset = '0'
              }
              if (data.ApiTypeID) {
                this.form.ApiTypeID = data.ApiTypeID.toString();
              }
              this.$nextTick(function () {
                window.scrollTo(0, 0)
              });

            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        if (this.dataValidate()) {
          if (this.form.MinAggregateAmount == '') {
            this.form.MinAggregateAmount = 0;
          }
          if (this.form.TokenDecimals == '') {
            this.form.TokenDecimals = 0;
          }
          if (this.form.ConfirmCount == '') {
            this.form.ConfirmCount = 0;
          }
          if (this.form.DecimalDigits == '') {
            this.form.DecimalDigits = 0;
          }
          if (this.form.OrderByNo == '') {
            this.form.OrderByNo = 0;
          }
          try {
            let config = {
              method: "POST",
              url: baseUrl + "Currency/DoCurrencyConfigAddOrEdit",
              data: this.form
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: res.data.msg || "操作成功！",
                  onClose: () => {
                    this.$router.push('/CurrencyConfig');
                  }
                });
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
        }
      },
      dataValidate(){
        if (!this.form.CurrencyName) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币名称不能为空！",
          });
          return false;
        }
        if (!this.form.CurrencyName_EN) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币名称英文不能为空！",
          });
          return false;
        }

        if (!this.form.CurrencyTypeID) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币类型不能为空！",
          });
          return false;
        }
        if (!this.form.ApiTypeID) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币API类型不能为空！",
          });
          return false;
        }
        if (!this.form.Unit) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币单位不能为空！",
          });
          return false;
        }
        if (!this.form.Symbol) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币符号不能为空！",
          });
          return false;
        }
        return true;
      },
      //图片上传
      handleAvatarSuccess(res, file) {
        //this.CardInfoUrlShow=URL.createObjectURL(file.raw);
        this.form.IconUrl = res.Data.SavePath;
        this.form.ShowIconUrl = res.Data.ShowPath;

      },
      handleAvatarSuccessGzh(res, file) {
        this.form.IconUrl = res.Data.SavePath;
        this.form.ShowIconUrl = res.Data.ShowPath;
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
        const isLt600kb = file.size / 1024 < 600;
        if (!isJPG) {
//          this.$message.error('上传图片只能是 JPG或PNG 格式!');
          this.$message.error('上传图片只能是 JPG 格式!');
        }
        if (!isLt600kb) {
          this.$message.error('上传图片大小不能超过 600kb!');
        }
        return isJPG && isLt600kb;
      },
      onEditorBlur(editor){//失去焦点事件
      },
      onEditorFocus(editor){//获得焦点事件
      },
      onEditorChange({editor, html, text}){//编辑器文本发生变化
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

  .form {
    margin-top: 30px;
    padding-bottom: 30px;
    margin-left: 100px;
    margin-right: 30px;
  }

  /deep/ .el-input {
    width: 460px;
  }

  /deep/ .upload {
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

  /deep/ .upload img {
    width: 60px;
    height: 60px;
  }

  /deep/ .avatar-uploader-icon {
    width: 100%;
    height: 100%;
    display: block;
    line-height: 58px;
    color: #777575;
  }

  /deep/ .el-upload--text {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
