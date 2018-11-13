<template>
  <div class="panel">
    <header class="panel-heading">APP升级管理</header>
    <section style="padding-bottom: 30px;">
      <div class="block lb">
        日期范围:
        从
        <el-date-picker
          v-model="beginTime"
          style="width: 200px;"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
        到
        <el-date-picker
          v-model="endTime"
          style="width: 200px;margin-right: 10px;"
          type="datetime"
          size="large"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="danger" @click="handleSearch">搜索</el-button>
      </div>
      <div style="padding: 0 20px 20px 20px;">
        <el-button type="success" @click="goEdit('News')">新增数据</el-button>
        <el-button type="info" @click="updateByIDs(0)">禁用数据</el-button>
        <el-button type="primary" @click="updateByIDs(1)">启用数据</el-button>
        <el-button type="danger" @click="updateByIDs(-1)">删除数据</el-button>
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
            prop="AppType"
            align="center"
            label="系统类型">
          </el-table-column>

          <el-table-column
            prop="Version"
            align="center"
            label="版本号">
          </el-table-column>

          <el-table-column
            align="LinkUrl"
            label="链接地址">
          </el-table-column>
          <el-table-column
            prop="Comments"
            align="center"
            label="版本说明">
          </el-table-column>
        </el-table>
      </div>

      <div class="page-wrap invite-page-wrap" style="text-align:center; margin: 30px 0;">
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
        endTime: '',
        beginTime: ''
      }
    },
    mounted(){
      this.getMarket();  //委托订单表格数据
    },
    methods: {
//        POST /api/MarketType/UpdateByIDs
      updateByIDs(Status, id){
        let self = this;
        let RecordIds=[];
        if (id) {
          RecordIds.push(id)
        } else {
          this.multipleSelection.map(function(n){
            RecordIds.push(n.ID)
          });
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "Document/UpdateNewsStatusByIDs",
            data:{
              RecordIds: RecordIds,
              Status: Status
            }
          };
          this.$axios(config).then(result => {
            if (Status==1) {
              if (result.data.Status) {
                self.$message({
                  type: "success",
                  message: "开启成功!",
                  onClose: () => {
                    self.getMarket()
                  }
                });
              }
            } else if (Status==0) {
              if (result.data.Status) {
                self.$message({
                  type: "success",
                  message: "禁用成功!",
                  onClose: () => {
                    self.getMarket()
                  }
                });
              }
            } else if (Status==-1) {
              if (result.data.Status) {
                self.$message({
                  type: "success",
                  message: "删除成功!",
                  onClose: () => {
                    self.getMarket()
                  }
                });
              }
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
            url: baseUrl + "AppUpdateLog/Index?pageIndex=" + this.PageIndex + '&pageSize=' + this.PageSize + '&endTime=' + this.endTime + '&beginTime=' + this.beginTime,
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
      handleSearch() {
        this.PageIndex = 1;
        this.getMarket ();
      },
      goEdit(isEdit, id) {  //编辑
        if (id) {
          this.$router.push('/AllEdit?isEdit=' + isEdit + '&id=' + id);
        } else {
          this.$router.push('/AllEdit?isEdit=' + isEdit);
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getMarket();
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
  .sp {display: block; width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
</style>
