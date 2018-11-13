<template>
  <div class="panel">
    <header class="panel-heading">加密货币充值提现配置</header>
    <section style="padding-bottom: 30px;">
      <div>
        <el-table
          width="100%"
          :data="tableData">
          <el-table-column
            prop="CurrencyID"
            label="货币编号"
            width="90">
          </el-table-column>

          <el-table-column
            prop="CurrencyName"
            label="货币名称"
            width="130">
          </el-table-column>

          <el-table-column
            label="货币图标"
            width="130">
            <template slot-scope="scope">
              <img :src="scope.row.IconUrl" class="imgIcon">
            </template>
          </el-table-column>

          <el-table-column 
            label="提现最小金额"
            width="160">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.MinWithdrawAmount)}}</span> 
            </template>
          </el-table-column>

          <el-table-column 
            label="提现最大金额"
            width="160">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.MaxWithdrawAmount)}}</span> 
            </template>
          </el-table-column>

          <el-table-column 
            label="每天提现限额"
            width="160">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.DayWithdrawAmount)}}</span> 
            </template>
          </el-table-column>

          <el-table-column 
            label="提现手续费率"
            width="160">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.WithdrawFeesRate)}}</span> 
            </template>
          </el-table-column>

          <el-table-column 
            label="最小提现手续费"
            width="160">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.MinWithdrawFeesAmount)}}</span> 
            </template>
          </el-table-column>

          <el-table-column
            label="是否开启充值"
            width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.IsCanDeposit == 1" style="color: #5cb85c">开启</span>
              <span v-else-if="scope.row.IsCanDeposit == 0" style="color: #EF6F66">关闭</span>
            </template>
          </el-table-column>

          <el-table-column
            label="是否开启提现"
            width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.IsCanWithdraw == 1" style="color: #5cb85c">开启</span>
              <span v-else-if="scope.row.IsCanWithdraw == 0" style="color: #EF6F66">关闭</span>
            </template>
          </el-table-column>

          <el-table-column
            label="是否开启币提现"
            width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.IsCanWithdrawBlock == 1" style="color: #5cb85c">开启</span>
              <span v-else-if="scope.row.IsCanWithdrawBlock == 0" style="color: #EF6F66">关闭</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="isPath==2" @click="goEdit(scope.row.CurrencyID)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;" v-if="tableData && tableData.length">
        <el-pagination
          prevText="<"
          nextText=">"
          @current-change="handleCurrentChange"
          layout="total,prev, pager, next, jumper"
          :total="totalCount"
          :page-size="PageSize"
          :current-page.sync="PageIndex"
          background>
        </el-pagination>
      </div>
    </section>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  export default {
    data(){
      return {
        tableData: [],
        multipleSelection: [],
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
        isPath:''
      }
    },
    created(){
      let path = this.$route.path.slice(1, this.$route.path.length);
      this.isPath=until.getPath(path)&2;
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getCurrency();
    },
    methods: {
      goEdit(id) {  //编辑
        this.$router.push('/CurrencyDWConfigAddOrEdit?id=' + id);
      },
      getCurrency(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "Currency/QueryCurrencyPage?pageindex=" + this.PageIndex + '&pagesize=' + this.PageSize,
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataList = res.data.Data;
              this.totalCount = dataList.TotalCount;
              this.tableData = dataList.DataList;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getCurrency();
      },
    },

    components: {}
  }

</script>

<style lang="scss" scoped>
  .panel {
    min-height: 680px;
  }

  .imgIcon {
    width: 30px;
    height: 30px;
    border-radius: 100%;
  }

  .statusIcon {
    display: inline-block;
    padding: 3px 9px;
    color: #fff;
    border-radius: 3px;
  }

  .typeList {
    padding: 0 20px;
    li {
      margin-right: 10px;
      font-size: 14px;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
    li:hover {
      background-color: rgba(65, 202, 192, .3);
      border: 1px solid rgba(65, 202, 192, .3);
      color: #fff;

    }
    .typeActive {
      background-color: #41cac0;
      border-color: #41cac0;
      color: #fff;
    }
  }

  .tit {
    border-color: #eff2f7;
    font-size: 16px;
    font-weight: 900;
    padding: 20px 20px;
    border-bottom: 1px solid transparent;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }

  .block {
    padding: 0 20px;
    label {
      margin-left: 10px;
    }
    .demonstration {
      margin-left: 10px;
    }
  }

  .el-input {
    margin: 15px 0;

  }

  /*/deep/ .el-input__inner {
    height: 36px;
  }*/

  .el-button {
    padding: 9px 20px;
  }

  .el-button--mini, .el-button--mini.is-round {
    padding: 4px 9px;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }
</style>
