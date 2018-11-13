<template>
  <div class="panel">
    <header class="panel-heading">市场类型管理</header>
    <section style="padding-bottom: 30px;">
      <div style="padding: 20px;">
        <el-button type="success" v-if="isAddPath==1" @click="goEdit(0,0)">新增数据</el-button>
        <el-button type="info" v-if="isPath==2" @click="updateByIDs(0,'禁用数据')">禁用数据</el-button>
        <el-button type="primary" v-if="isPath==2" @click="updateByIDs(1,'启用数据')">启用数据</el-button>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            prop="MarketTypeId"
            label="市场类型编号"
            width="160">
          </el-table-column>

          <el-table-column
            prop="MarketTypeName"
            label="市场类型名称"
            width="230">
          </el-table-column>

          <el-table-column
            label="市场货币"
            width="230">
            <template slot-scope="scope">
              <span>{{scope.row.CurrencyName}}</span>---
              <span>{{scope.row.Unit}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="OrderByNo"
            label="排序编号"
            width="230">
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            label="创建时间"
            width="230">
          </el-table-column>

          <el-table-column
            label="状态"
            width="190">
            <template slot-scope="scope">
              <span v-if="scope.row.RecordStatus == 1" style="color: #5cb85c">正常</span>
              <span v-else-if="scope.row.RecordStatus == 0" style="color: #EF6F66">禁用</span>
              <span v-else style="color: #ff6c60">已删除</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="isPath==2" @click="goEdit(1,scope.row.MarketTypeId)">编辑</el-button>
              <el-button type="primary" size="mini" v-if="isPath==2" @click="gocurrencyEx(1,scope.row.MarketTypeId)">查看交易对</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;"
           v-if="tableData && tableData.length">
        <el-pagination
          prevText="<"
          nextText=">"
          @current-change="handleCurrentChange"
          layout="total,prev, pager, next, jumper"
          :total="totalCount"
          :page-size="PageSize"
          :current-page.sync="PageIndex"
          background
        >
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
        isPath: '',
        isAddPath: ''
      }
    },
    created(){
      let path = this.$route.path.slice(1, this.$route.path.length);
      this.isPath = until.getPath(path) & 2;
      this.isAddPath = until.getPath(path) & 1;
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getMarket();  //委托订单表格数据
    },
    methods: {
      updateByIDs(Status, name){
        this.$confirm('是否确认' + name + '？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateHandle(Status);

        }).catch(() => {
          /*   this.$message({
           type: 'info',
           message: '已取消删除'
           });*/
        });
      },
      updateHandle(Status){
        let RecordIds = [];
        this.multipleSelection.map((n) => {
          RecordIds.push(n.MarketTypeId)
        });

        if (RecordIds.length == 0) {
          this.$message({
            type: "error",
            message: "请先选择数据!",
          });
          return false;
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "MarketType/UpdateByIDs",
            data: {
              RecordIds: RecordIds,
              Status: Status
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              if (Status == 0) {
                this.$message({
                  type: "success",
                  message: "禁用成功",
                });
              } else {
                this.$message({
                  type: "success",
                  message: "启用成功",
                });
              }
              this.getMarket();
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getMarket(){
        try {
          let config = {
            method: "GET",
            url: baseUrl + "MarketType/MarketTypeList?pageindex=" + this.PageIndex + '&pagesize=' + this.PageSize,
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
      goEdit(isEdit, id) {  //编辑
        this.$router.push('/MarketTypeEditOrAdd?isEdit=' + isEdit + '&id=' + id);
      },
      gocurrencyEx(isEdit, id) {  //编辑
        this.$router.push('/CurrencyExchange?marketid=' + id);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getCurrency();
      }
    },

    components: {}
  }

</script>

<style lang="scss" scoped>
  .panel {
    min-height: 680px;
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
