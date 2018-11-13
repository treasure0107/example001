<template>
  <div class="panel">
    <header class="panel-heading"><span v-if="!isShow">添加货币介绍</span><span v-if="isShow">修改货币介绍</span></header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="货币名称">
          <el-select v-model="form.CurrencyId" placeholder="货币名称" :disabled="isShow" class="el-select-re">
            <el-option
              v-for="item in currencyList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发行时间">
          <el-date-picker
            v-model="form.IssueDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="发行总量">
          <el-input @change="cha()" v-model="form.IssueVolume"><span slot="append">万</span></el-input>
        </el-form-item>
        <el-form-item label="流通总量">
          <el-input @change="cha1()" v-model="form.MarketVolume "><span slot="append">万</span></el-input>
        </el-form-item>
        <el-form-item label="众筹价格">
          <el-input @change="cha2()" v-model="form.Price"><span slot="append">美元</span></el-input>
        </el-form-item>
        <el-form-item label="白皮书地址">
          <el-input v-model="form.WhiteBookUrl"></el-input>
        </el-form-item>
        <el-form-item label="官网地址">
          <el-input v-model="form.WebSiteUrl"></el-input>
        </el-form-item>
        <el-form-item label="区块查询地址">
          <el-input v-model="form.BlockUrl"></el-input>
        </el-form-item>
        <el-form-item label="货币介绍">
          <el-input type="textarea" v-model="form.Comments"></el-input>
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
  export default {
    data(){
      return {
        id: '',
        currencyList: [],
        marketTypeList: [],
        checkList: [],
        isEdit: '',
        isShow: true,
        form: {
          "CurrencyName": "",
          "Unit": "",
          "BizComments": "",
          "BizWhiteBookUrl": "",
          "BizWebSiteUrl": "",
          "BizBlockUrl": "",
          "Id": 0,
          "CurrencyId": '',
          "IssueDate": "",
          "IssueVolume": '',
          "MarketVolume": '',
          "Price": '',
          "WhiteBookUrl": "",
          "WebSiteUrl": "",
          "BlockUrl": "",
          "Comments": "",
          "CreateTime": "",
          "ModifyTime": "",
          "RecordStatus": 0
        },
      }

    },
    created(){
      this.isEdit = this.$route.query.isEdit;
      if (this.isEdit == 1) {
        this.id = this.$route.query.id;
        this.form.CEID = this.$route.query.id;
      }
    },
    mounted(){
      this.getQueryCurrencyPage();   //获取货币列表（用于下拉列表）
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
            url: baseUrl + "Currency/QueryCurrencyPageForList",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.currencyList = res.data.Data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      cha(){
        var n = this.form.IssueVolume.indexOf(".")
        if(n>0){
          this.$message({
            type: "error",
            duration: 1000,
            message: "只能输入一位小数点！",
            onClose: () => {
              this.form.IssueVolume = ''
            }
          });
        }
      },
      cha1(){
        var n = this.form.MarketVolume.indexOf(".")
        if(n>0){
          this.$message({
            type: "error",
            duration: 1000,
            message: "只能输入一位小数点！",
            onClose: () => {
              this.form.MarketVolume = ''
            }
          });
        }
      },
      cha2(){
        var n = this.form.Price.indexOf(".")
        if(n>0){
          this.$message({
            type: "error",
            duration: 1000,
            message: "只能输入一位小数点！",
            onClose: () => {
              this.form.Price = ''
            }
          });
        }
      },
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/GetCurrencyConfigExpandById/" + this.id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.form = res.data.Data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        if (this.dataValidate()) {
          try {
            let config = {
              method: "POST",
              url: baseUrl + "Currency/EditCurrencyConfigExpand",
              data: {
                "Id": this.form.Id,
                "CurrencyId": this.form.CurrencyId,
                "IssueDate": this.form.IssueDate,
                "IssueVolume": this.form.IssueVolume,
                "MarketVolume": this.form.MarketVolume,
                "Price": this.form.Price,
                "WhiteBookUrl": this.form.WhiteBookUrl,
                "WebSiteUrl": this.form.WebSiteUrl,
                "BlockUrl": this.form.BlockUrl,
                "Comments": this.form.Comments,
                "ModifyTime": this.form.ModifyTime,
                "RecordStatus": this.form.RecordStatus
              }
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: res.data.msg || "操作成功！",
                  onClose: () => {
                    this.$router.push('/CurrencyConfigExpand');
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
        if (!this.form.CurrencyId) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币名称不能为空！",
          });
          return false;
        }
        if (!this.form.IssueDate) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "发行时间不能为空！",
          });
          return false;
        }
        if (!this.form.IssueVolume) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "发行总量不能为空！",
          });
          return false;
        }
        if (!this.form.MarketVolume) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "流通总量不能为空！",
          });
          return false;
        }
        if (!this.form.Price) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "众筹价格不能为空！",
          });
          return false;
        }
        if (!this.form.WebSiteUrl) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "官网地址不能为空！",
          });
          return false;
        }
        if (!this.form.Comments) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币介绍不能为空！",
          });
          return false;
        }
        if (isNaN(this.form.IssueVolume) == true) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '发行总量只能为数字！',
            type: 'error'
          });
          return false;
        }
        if (isNaN(this.form.MarketVolume) == true) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '流通总量只能为数字！',
            type: 'error'
          });
          return false;
        }
        if (isNaN(this.form.Price) == true) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '众筹价格只能为数字！',
            type: 'error'
          });
          return false;
        }
        return true;
      }
    },
    components: {}
  }
</script>
<style lang="scss" scoped>
  .form {
    margin-top: 30px;
    padding-bottom: 30px;
    margin-left: 100px;
  }

  /deep/ .el-input, .el-textarea {
    width: 460px;
  }

  /deep/ .el-textarea__inner {
    height: 360px;
  }
</style>
