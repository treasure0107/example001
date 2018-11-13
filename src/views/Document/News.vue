<template>
  <div class="panel">
    <header class="panel-heading">新闻公告管理</header>
    <section style="padding-bottom: 30px;">
      <div style="padding: 20px;">
        <el-button type="success" @click="goEdit('News')" v-if="addShow">新增数据</el-button>
        <el-button type="info" @click="updateByIDs(0)" v-if="editShow">禁用数据</el-button>
        <el-button type="primary" @click="updateByIDs(1)" v-if="editShow">启用数据</el-button>
        <el-button type="danger" @click="updateByIDs(-1)" v-if="delShow">删除数据</el-button>
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
            prop="ID"
            align="center"
            label="编号"
            width="80">
          </el-table-column>

          <el-table-column
            prop="TypeName"
            align="center"
            width="80"
            label="类型">
          </el-table-column>

          <el-table-column
            prop="DocTitle"
            align="center"
            label="标题">
            <template slot-scope="scope">
              <span class="sp" v-text="scope.row.DocTitle"></span>
            </template>
          </el-table-column>

          <el-table-column
            prop="DocTitle_EN"
            align="center"
            label="标题_英文">
            <template slot-scope="scope">
              <span class="sp" v-text="scope.row.DocTitle_EN"></span>
            </template>
          </el-table-column>
          <!--<el-table-column
            prop="DocContent"
            align="center"
            label="内容">
            <template slot-scope="scope">
              <span class="sp" v-text="scope.row.DocContent"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="DocContent_EN"
            align="center"
            label="内容_英文">
            <template slot-scope="scope">
              <span class="sp" v-text="scope.row.DocContent_EN"></span>
            </template>
          </el-table-column>-->
          <el-table-column
            prop="CreateTime"
            align="center"
            width="180"
            label="创建时间">
          </el-table-column>

          <el-table-column
            label="状态"
            align="center"
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.RecordStatus == 1" style="color: #5cb85c">正常</span>
              <span v-else-if="scope.row.RecordStatus == 0" style="color: #EF6F66">禁用</span>
              <span v-else style="color: #ff6c60">已删除</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="goEdit('News',scope.row.ID)" v-if="editShow">编辑</el-button>
              <el-button type="danger" size="mini" @click="updateByIDs(-1,scope.row.ID)" v-if="delShow">删除</el-button>
            </template>
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
        addShow: '',
        editShow: '',
        delShow: ''
      }
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getMarket();  //委托订单表格数据
      let path = this.$route.path
      let pvalue = until.getPath((path).substr(1));
      this.addShow = (pvalue&1)==1?true:false;
      this.editShow = (pvalue&2)==2?true:false;
      this.delShow = (pvalue&4)==4?true:false;
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
            if (until.responesValidate(result)) {
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
            url: baseUrl + "Document/QueryNews?pageindex=" + this.PageIndex + '&pagesize=' + this.PageSize,
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
  .sp {display: block; width:500px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
</style>
