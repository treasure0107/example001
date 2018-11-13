<template>
  <div class="panel">
    <header class="panel-heading">加密货币基本信息配置</header>
    <section style="padding-bottom: 30px;">
      <div style="padding: 20px;">
        <el-button type="success" v-if="isAddPath==1" @click="goEdit(0,'')">新增数据</el-button>
      </div>
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
            width="110">
            <template slot-scope="scope">
              <img :src="scope.row.IconUrl" class="imgIcon">
            </template>
          </el-table-column>

          <el-table-column
            prop="CurrencyTypeName"
            label="货币类型"
            width="130">
          </el-table-column>

          <el-table-column
            prop="ApiTypeName"
            label="货币接口类型"
            width="130">
          </el-table-column>

          <el-table-column
            prop="Unit"
            label="货币单位"
            width="130">
          </el-table-column>

          <el-table-column
            prop="Symbol"
            label="货币符号"
            width="100">
          </el-table-column>

          <el-table-column
            prop="OrderByNo"
            label="排序编号"
            width="130">
          </el-table-column>

          <el-table-column
            prop="Comments"
            label="备注"
            width="160">
          </el-table-column>

          <el-table-column
            prop="CreateTime"
            label="创建时间"
            width="160">
          </el-table-column>

          <el-table-column
            label="状态"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.RecordStatus == 1" style="color: #5cb85c">正常</span>
              <span v-else-if="scope.row.RecordStatus == 0" style="color: #EF6F66">禁用</span>
              <span v-else style="color: #ff6c60">已删除</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="isPath==2" @click="goEdit(1,scope.row.CurrencyID)">编辑</el-button>
              <el-button type="success" size="mini" v-if="isPath==2" @click="updateByIDs(1,scope.row.CurrencyID,'启用')">启用</el-button>
              <el-button type="warning" size="mini" v-if="isPath==2" @click="updateByIDs(0,scope.row.CurrencyID,'禁用')">禁用</el-button>
              <el-button type="danger" size="mini" v-if="isDelPath==4" @click="updateByIDs(-1,scope.row.CurrencyID,'删除')">删除</el-button>
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
        isPath:'',
        isAddPath:'',
        isDelPath:''
      }
    },
    created(){
      let path = this.$route.path.slice(1, this.$route.path.length);
      this.isPath=until.getPath(path)&2;
      this.isAddPath=until.getPath(path)&1;
      this.isDelPath=until.getPath(path)&4;
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.getCurrency();
    },
    methods: {
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
      updateByIDs(Status,currencyID,name){
        this.$confirm('是否确认'+name+'？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateHandle(Status,currencyID);

        }).catch(() => {
     /*     this.$message({
            type: 'info',
            message: '已取消删除'
          });*/
        });
      },
      updateHandle(Status,currencyID){
        let RecordIds = [];
      /*  this.multipleSelection.map((n) => {
          RecordIds.push(n.CEID)
        });*/
        RecordIds.push(currencyID);
        try {
          let config = {
            method: "POST",
            url: baseUrl + "Currency/UpdateCurrencyConfigStatusByIDs",
            data: {
              RecordIds: RecordIds,
              Status: Status
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.getCurrency();
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      goEdit(isEdit, id) {  //编辑
        if(isEdit==1){
          this.$router.push('/CurrencyConfigAddOrEdit?isEdit=' + isEdit + '&id=' + id);
        }
        if(isEdit==0){
          this.$router.push('/CurrencyConfigAddOrEdit?isEdit=' + isEdit);
        }
      }
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
    margin-left: 0;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }
</style>
