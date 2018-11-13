<template>
  <div class="panel">
    <header class="panel-heading"><span v-if="!isShow">添加加密货币交易</span><span v-if="isShow">修改加密货币交易</span></header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="货币">
          <el-select v-model="form.CurrencyID" placeholder="货币" :disabled="isShow" class="el-select-re">
            <el-option
              v-for="item in currencyList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易市场">
          <el-select v-model="form.MarketTypeID" placeholder="交易市场" :disabled="isShow" class="el-select-re">
            <el-option
              v-for="item in marketTypeList"
              :key="item.MarketTypeId"
              :label="item.MarketTypeName"
              :value="item.MarketTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="买入手续费率">
          <el-input v-model="form.BuyFeesRate"></el-input>
        </el-form-item>
        <el-form-item label="卖出手续费率">
          <el-input v-model="form.SellFeesRate"></el-input>
        </el-form-item>
        <el-form-item label="最低委托价格">
          <el-input v-model="form.MinEntrustPrice"></el-input>
        </el-form-item>
        <el-form-item label="最低委托数量">
          <el-input v-model="form.MinEntrustVolume"></el-input>
        </el-form-item>
        <el-form-item label="首次发行价格">
          <el-input v-model="form.ICOPrice"></el-input>
        </el-form-item>
        <el-form-item label="每日涨幅限制">
          <el-input v-model="form.ChangeRangeHighRate"></el-input>
        </el-form-item>
        <el-form-item label="每日跌幅限制">
          <el-input v-model="form.ChangeRangeLowRate"></el-input>
        </el-form-item>
        <el-form-item label="是否显示在首页">
          <template>
            <el-radio v-model="form.IsShowInHome" label="1">显示</el-radio>
            <el-radio v-model="form.IsShowInHome" label="0">不显示</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否开启交易">
          <template>
            <el-radio v-model="form.IsEnableTrade" label="1">开启</el-radio>
            <el-radio v-model="form.IsEnableTrade" label="0">关闭</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="交易休市日期">
          <template>
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="1">星期一</el-checkbox>
              <el-checkbox label="2">星期二</el-checkbox>
              <el-checkbox label="3">星期三</el-checkbox>
              <el-checkbox label="4">星期四</el-checkbox>
              <el-checkbox label="5">星期五</el-checkbox>
              <el-checkbox label="6">星期六</el-checkbox>
              <el-checkbox label="7">星期日</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="交易上午开始时间">
          <el-time-select
            placeholder="起始时间"
            v-model="form.TradeTimeAMStart"
            :picker-options="{
            start: '00:05',
            step: '00:05',
             end: '12:00'
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="交易上午结束时间">
          <template>
            <el-time-select
              placeholder="结束时间"
              v-model="form.TradeTimeAMEnd"
              :picker-options="{
                start: '00:05',
                step: '00:05',
                 end: '12:00',
              minTime: form.TradeTimeAMStart
            }">
            </el-time-select>
          </template>
        </el-form-item>
        <el-form-item label="交易下午午开始时间">
          <el-time-select
            placeholder="起始时间"
            v-model="form.TradeTimePMStart"
            :picker-options="{
                 start: '12:05',
                 step: '00:05',
                 end: '23:55'
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="交易下午结束时间">
          <template>
            <el-time-select
              placeholder="结束时间"
              v-model="form.TradeTimePMEnd"
              :picker-options="{
                 start: '12:05',
                 step: '00:05',
                 end: '23:55',
              minTime: form.TradeTimePMStart
            }">
            </el-time-select>
          </template>
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
          IsShowInHome: '1',
          IsEnableTrade: '1',
          BuyFeesRate: 0,
          SellFeesRate: 0,
          MarketTypeID: '',
          ICOPrice: 0,
          MinEntrustVolume: 0,
          MinEntrustPrice: 0,
          CloseTradeDayStr: '',
          TradeTimeAMStart: '',
          TradeTimeAMEnd: '',
          TradeTimePMStart: '',
          TradeTimePMEnd: '',
          ChangeRangeHighRate: 0,
          ChangeRangeLowRate: 0,
          Comments: '',
          OrderByNo: 0,
          CurrencyID: '',
          CEID: 0,
        }
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
      this.getMarketTypeList();   //获取货币列表（用于下拉列表）
      if (this.isEdit == 1) {
        this.isShow = true;
        this.getDetails();
      } else {
        this.isShow = false;
      }
    },
    methods: {
      getQueryCurrencyPage(){   //获取货币列表 Currency/QueryCurrencyPage/
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
            url: baseUrl + "Currency/GetCurrencyExchangeById?ceid=" + this.id,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let data = res.data.Data;
              this.form.CurrencyID = data.CurrencyID;
              this.form.MarketTypeID = data.MarketTypeID;
              this.form.BuyFeesRate = data.BuyFeesRate;   //买入手续费比例
              this.form.SellFeesRate = data.SellFeesRate;   //卖出手续费比例
              this.form.MinEntrustPrice = data.MinEntrustPrice;   //最低委托价格
              this.form.MinEntrustVolume = data.MinEntrustVolume;   //最低委托数量
              this.form.ICOPrice = data.ICOPrice;   //首次发行价格
              this.form.ChangeRangeHighRate = data.ChangeRangeHighRate;   //每日涨幅限制
              this.form.ChangeRangeLowRate = data.ChangeRangeLowRate;   //每日跌幅限制
              if (data.IsShowInHome == 1 || data.IsShowInHome == 0) {
                this.form.IsShowInHome = data.IsShowInHome.toString();   //是否显示在首页
              }
              if (data.IsEnableTrade == 1 || data.IsEnableTrade == 0) {
                this.form.IsEnableTrade = data.IsEnableTrade.toString();   //是否开启交易
              }
              this.form.CloseTradeDayStr = data.CloseTradeDayStr;   //交易休市日期   （数组）
              if (this.form.CloseTradeDayStr) {
                this.checkList = this.form.CloseTradeDayStr.split(",")


              }
              this.form.TradeTimeAMStart = data.TradeTimeAMStart;   //交易上午开始时间
              this.form.TradeTimeAMEnd = data.TradeTimeAMEnd;   //交易上午结束时间
              this.form.TradeTimePMStart = data.TradeTimePMStart;   //交易下午开始时间
              this.form.TradeTimePMEnd = data.TradeTimePMEnd;   //交易下午开始时间
              this.form.OrderByNo = data.OrderByNo;   //排序编号
              this.form.Comments = data.Comments;   //备注
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      submitForm(){
        this.form.CloseTradeDayStr = this.checkList.join(',');
        if (this.dataValidate()) {
          if (this.form.TradeTimeAMStart || this.form.TradeTimeAMEnd || this.form.TradeTimePMStart || this.form.TradeTimePMEnd) {
            if (!this.form.TradeTimeAMEnd) {
              this.$message({
                type: "error",
                duration: 1000,
                message: "请选择交易上午结束时间！",
              });
              return false;
            }
            if (!this.form.TradeTimeAMStart) {
              this.$message({
                type: "error",
                duration: 1000,
                message: "请选择交易上午开始时间！",
              });
              return false;
            }
            if (!this.form.TradeTimePMStart) {
              this.$message({
                type: "error",
                duration: 1000,
                message: "请选择交易下午午开始时间！",
              });
              return false;
            }
            if (!this.form.TradeTimePMEnd) {
              this.$message({
                type: "error",
                duration: 1000,
                message: "请选择交易下午结束时间！",
              });
              return false;
            }
          }
          try {
            let config = {
              method: "POST",
              url: baseUrl + "Currency/DoCurrencyExchangeAddOrEdit",
              data: this.form
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: res.data.msg || "操作成功！",
                  onClose: () => {
                    this.$router.push('/CurrencyExchange');
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
        if (!this.form.CurrencyID) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "货币名称不能为空！",
          });
          return false;
        }
        if (!this.form.MarketTypeID) {
          this.$message({
            type: "error",
            duration: 1000,
            message: "交易市场不能为空！",
          });
          return false;
        }
        /*       if (!this.form.BuyFeesRate) {
         this.$message({
         type: "error",
         duration: 1000,
         message: "买入手续费率不能为空！",
         });
         return false;
         }
         if (!this.form.SellFeesRate) {
         this.$message({
         type: "error",
         duration: 1000,
         message: "卖出手续费率不能为空！",
         });
         return false;
         }*/
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

  /deep/ .el-input {
    width: 460px;
  }
</style>
