<template>
  <div class="panel">
    <header class="panel-heading">修改加密货币充值提现配置</header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="货币名称" prop="CurrencyName">
          <el-input v-model="form.CurrencyName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="是否开启充值" prop="IsCanDeposit">
          <template>
            <el-radio-group v-model="form.IsCanDeposit">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>

        <el-form-item label="是否开启提现" prop="IsCanWithdraw">
          <template>
            <el-radio-group v-model="form.IsCanWithdraw">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="是否开启币提现" prop="IsCanWithdrawBlock ">
          <template>
            <el-radio-group v-model="form.IsCanWithdrawBlock">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>

        <el-form-item label="提现最小金额" prop="MinWithdrawAmount">
          <el-input v-model="form.MinWithdrawAmount "></el-input>
        </el-form-item>
        <el-form-item label="提现最大金额" prop="MaxWithdrawAmount">
          <el-input v-model="form.MaxWithdrawAmount "></el-input>
        </el-form-item>
        <el-form-item label="每天提现限额" prop="DayWithdrawAmount">
          <el-input v-model="form.DayWithdrawAmount"></el-input>
        </el-form-item>
        <el-form-item label="提现手续费率" prop="WithdrawFeesRate">
          <el-input v-model="form.WithdrawFeesRate "></el-input>
        </el-form-item>
        <el-form-item label="最少提现手续费" prop="MinWithdrawFeesAmount">
          <el-input v-model="form.MinWithdrawFeesAmount"></el-input>
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
        form: {
          CurrencyID: '',
          CurrencyName: '',   //货币名称
          MinWithdrawAmount: '',   //提现最小金额
          MaxWithdrawAmount: '',   //提现最大金额
          DayWithdrawAmount: '',   //每天提现限额
          WithdrawFeesRate: '',   //提现手续费率
          MinWithdrawFeesAmount: '',   //最少提现手续费
          IsCanDeposit: '',
          IsCanWithdraw: '',
          IsCanWithdrawBlock: '',
        }
      }

    },
    created(){
      this.form.CurrencyID = this.$route.query.id;
    },
    mounted(){
      this.getDetails();
    },
    methods: {
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/GetCurrencyDWConfigById/" + this.form.CurrencyID,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let data = res.data.Data;
              this.form.CurrencyName = data.CurrencyName;
              this.form.MinWithdrawAmount = data.MinWithdrawAmount;
              this.form.MaxWithdrawAmount = data.MaxWithdrawAmount;
              this.form.DayWithdrawAmount = data.DayWithdrawAmount;
              this.form.WithdrawFeesRate = data.WithdrawFeesRate;
              this.form.MinWithdrawFeesAmount = data.MinWithdrawFeesAmount;
              if(data.IsCanDeposit==1 || data.IsCanDeposit==0){
                this.form.IsCanDeposit = data.IsCanDeposit.toString();
              }
              if(data.IsCanWithdraw==1 || data.IsCanWithdraw==0){
                this.form.IsCanWithdraw = data.IsCanWithdraw.toString();
              }
              if(data.IsCanWithdrawBlock==1 || data.IsCanWithdrawBlock==0){
                this.form.IsCanWithdrawBlock = data.IsCanWithdrawBlock.toString();
              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        try {
          let config = {
            method: "POST",
            url: baseUrl + "Currency/DoCurrencyDWConfigAddOrEdit",
            data: this.form
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.$message({
                type: "success",
                duration: 1000,
                message: res.data.Msg || "操作成功！",
                onClose: () => {
                  this.$router.push('/CurrencyDWConfig');
                }
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
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

  /deep/ .el-input {
    width: 460px;
  }
</style>
