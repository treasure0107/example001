<template>
  <div class="panel">
    <header class="panel-heading">角色管理</header>
    <section style="padding-bottom: 30px;">
      <div style="padding: 20px 20px 20px 20px;">
        <el-button type="success" @click="goEdit(0)" v-if="addShow">新增数据</el-button>
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
            prop="RoleID"
            align="center"
            label="角色编号"
            width="100">
          </el-table-column>

          <el-table-column
            prop="RoleName"
            align="center"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="Comments"
            align="center"
            label="备注">
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">
              <span v-text="scope.row.RecordStatus==1?'启用':'禁用'"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="CreateTime"
            align="center"
            label="创建时间">
          </el-table-column>
          <el-table-column
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="goEdit(scope.row.RoleID)" v-if="editShow">编辑</el-button>
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
        endTime: '',
        beginTime: '',
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
      updateByIDs(Status){
        let self = this;
        let Ids=[];
        this.multipleSelection.map(function(n){
          Ids.push(n.RoleID)
        });
        try {
          let config = {
            method: "POST",
            url: baseUrl + "SysApi/UpdateAdminRoleStatus",
            data:{
              Ids: Ids,
              Status: Status
            }
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              if (Status == 1) {
                if (result.data.Status) {
                  self.$message ({
                    type: "success",
                    message: "开启成功!",
                    onClose: () => {
                      self.getMarket ()
                    }
                  });
                }
              } else if (Status == 0) {
                if (result.data.Status) {
                  self.$message ({
                    type: "success",
                    message: "禁用成功!",
                    onClose: () => {
                      self.getMarket ()
                    }
                  });
                }
              } else if (Status == -1) {
                if (result.data.Status) {
                  self.$message ({
                    type: "success",
                    message: "删除成功!",
                    onClose: () => {
                      self.getMarket ()
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
            url: baseUrl + "SysApi/AdminRoleList?pageindex=" + this.PageIndex + '&pagesize=' + this.PageSize,
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
      goEdit(id) {  //编辑
        this.$router.push('/RoleEdit?id=' + id);
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
  .mui-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 998;
    background-color: rgba(0,0,0,.3);
  }
  .conImg {
    margin: auto;
    margin-top: 15%;
    background: #fff;
    width: 500px;
    height: 500px;
  }
</style>
