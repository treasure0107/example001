<template>
  <div class="panel">
    <header class="panel-heading">申诉订单管理</header>
    <section style="padding-bottom: 30px;">
      <div class="block" style="margin: 30px 0;">
        <label>订单编号：</label>
        <el-input style="width:190px;margin-right: 30px;" type="text" placeholder="请输入内容" v-model="OrderId"></el-input>
        <label>申诉状态：</label>
        <el-select style="width:160px;" v-model="IussueStatus" placeholder="全部">
          <el-option label="全部" value=""></el-option>
          <el-option label="申诉中" value="0"></el-option>
          <el-option label="申诉通过" value="1"></el-option>
          <el-option label="申诉失败" value="-1"></el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch" style="margin-left: 30px;">搜索</el-button>
        <el-button type="success" @click="refresh">刷新</el-button>
      </div>
      <div>
        <el-table
          width="100%"
          :data="tableData">
          <el-table-column
            prop="OrderId"
            label="订单编号"
            width="160">
          </el-table-column>
          <el-table-column
            label="交易类型"
            width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.Tradetype == 'Buy'" style="color: #39B6AE">用户买入</span>
              <span v-else style="color: #EF6F66">用户卖出</span>
            </template>
          </el-table-column>
           <el-table-column
            label="纠纷类型"
            width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.Tradetype == 'Buy'?(scope.row.UserId==scope.row.IssueUserId?true:false):(scope.row.UserId!=scope.row.IssueUserId?true:false)" style="color: #39B6AE">买方申诉</span>
              <span v-else style="color: #EF6F66">卖方申诉</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="CoinUnit"
            label="货币单位"
            width="100">
          </el-table-column>

          <el-table-column 
            label="交易数量"
            width="190">
              <template slot-scope="scope">
              <span>{{parseFloat(scope.row.Volume)}}</span> 
            </template>
          </el-table-column>
          <el-table-column
            label="支付方式"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.PayType == 2">银行</span>
              <span v-if="scope.row.PayType == 4">支付宝</span>
              <span v-if="scope.row.PayType == 8">不限</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="IussueUserName"
            label="申诉人昵称"
            width="160">
          </el-table-column>

          <el-table-column
            prop="MerchantUserName"
            label="商户昵称"
            width="160">
          </el-table-column>
          <!--<el-table-column
            prop="UserName"
            label="散户昵称"
            width="160">
          </el-table-column>-->
          <el-table-column
            label="申诉状态"
            width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.IussueStatus == 0" style="color: #39B6AE">申诉中</span>
              <span v-if="scope.row.IussueStatus == 1" style="color: #EF6F66">胜诉</span>
              <span v-if="scope.row.IussueStatus == -1" style="color: #EF6F66">败诉</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="IssueTime"
            label="申诉时间"
            width="160">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="isPath==2&&scope.row.IussueStatus==0" @click="goAppeal(scope.row.OrderId)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;" v-if="tableData && tableData.length">
        <el-pagination
          prevText="<"
          nextText=">"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          :page-size="PageSize"
          :current-page.sync="PageIndex"
          background
        ></el-pagination>
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
        OrderId: '',
        IussueStatus: '',
        isPath: ''
      }
    },
    created(){
      let path = this.$route.path.slice(1, this.$route.path.length);
      this.isPath = until.getPath(path) & 2;
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getList();
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    methods: {
      handleSearch(){
        this.PageIndex = 1;
        this.getList();
      },
      goAppeal(id) {  //申诉
        this.$router.push('/OrderAppealDetails?id=' + id);
      },
      refresh(){
        this.OrderId = ''
        this.IussueStatus = ''
        this.PageIndex=1
        this.getList()
      },
      getList(){
        try {
          let config = {
            method: "POST",
            url: baseUrl + "C2C/GetOtcOrderPageList",
            data: {
              OrderId: this.OrderId,
              IussueStatus: this.IussueStatus,
              PageIndex: this.PageIndex,
              PageSize: this.PageSize
            }
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
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getList();
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getList();
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
