<template>
  <div class="panel">
    <header class="panel-heading"><span v-if="!isShow">添加市场类型</span><span v-if="isShow">修改市场类型</span></header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="市场类型名称" prop="name">
          <el-input v-model="form.MarketTypeName"></el-input>
        </el-form-item>
        <el-form-item label="市场货币" prop="name">
          <el-select v-model="form.CurrencyID" placeholder="市场货币"
                     class="el-select-re">
            <el-option
              v-for="item in currencyConfigList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序编号" prop="OrderByNo">
          <el-input v-model="form.OrderByNo"></el-input>
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
        id: 0,
        isEdit: '',
        isShow: true,
        form: {
          MarketTypeName: "",
          CurrencyID: "",
          OrderByNo: ''
        },
        currencyConfigList: []
      }
    },
    created(){
      this.id = this.$route.query.id;
      this.isEdit = this.$route.query.isEdit;
    },
    mounted(){
      this.GetCurrencyConfigList();
      if (this.isEdit == 1) {
        this.isShow = true;
        this.getDetails();
      } else {
        this.isShow = false;
      }
    },
    methods: {
      getDetails(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "MarketType/GetById?id=" + this.id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let data = res.data.Data;
              this.form.MarketTypeName = data.MarketTypeName;
              this.form.OrderByNo = data.OrderByNo;
              this.form.CurrencyID = data.CurrencyID
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      GetCurrencyConfigList(){   //User/GetCurrencyConfigList
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/QueryCurrencyPageForList?pageindex=1&pagesize=100",
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.currencyConfigList = res.data.Data;
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
              url: baseUrl + "MarketType/MarketUpdateOrAdd",
              data: {
                marketTypeId: this.id,
                marketTypeName: this.form.MarketTypeName,
                orderByNo: this.form.OrderByNo,
                currencyId: this.form.CurrencyID
              }
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: res.data.msg || "操作成功！",
                  onClose: () => {
                    this.$router.push('/MarketTypeList');
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
        if (!this.form.MarketTypeName) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "市场类型名称不能为空！",
          });
          return false;
        }
        if (!this.form.CurrencyID) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "市场货币不能为空！",
          });
          return false;
        }
        if (!this.form.OrderByNo) {
          this.form.OrderByNo = 0;
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
  }

  /deep/ .el-input {
    width: 400px;
  }
</style>
