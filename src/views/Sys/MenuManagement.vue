<template>
  <div class="panel">
    <header class="panel-heading">菜单管理</header>
    <section style="padding-bottom: 30px;">
      <div class="block">
        <label>菜单名称：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="MenuName"></el-input>
        <label>菜单地址：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="LinkUrl"></el-input>
        <label>菜单类型：</label>
        <el-select style="width:160px;" placeholder="全部" v-model="MenuType">
          <el-option label="全部" value=""></el-option>
          <el-option label="Menu" value="0"></el-option>
          <el-option label="Api" value="1"></el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</el-button>
        <el-button type="success" @click="handleReset">刷新</el-button>
      </div>
      <div style="padding: 20px;">
        <el-button type="success" v-if="isAddPath==1" @click="goEdit(0,'')">新增数据</el-button>
        <el-button type="info" v-if="isPath==2" @click="updateByIDs(0,'禁用数据')">禁用数据</el-button>
        <el-button type="primary" v-if="isPath==2" @click="updateByIDs(1,'启用数据')">启用数据</el-button>
        <el-button type="danger" v-if="isDelPath==4" @click="updateByIDs(-1,'删除数据')">删除数据</el-button>
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
            prop="MenuName"
            label="菜单名"
            width="160">
          </el-table-column>
          <el-table-column
            prop="MenuName_EN"
            label="菜单英文名"
            width="190">
          </el-table-column>
          <el-table-column
            prop="MenuFaName"
            label="菜单图标样式"
            width="160">
          </el-table-column>
          <el-table-column
            prop="LinkUrl"
            label="菜单地址"
            width="400">
          </el-table-column>
          <el-table-column
            prop="MenuTypeName"
            label="菜单类型"
            width="140">
          </el-table-column>
          <el-table-column
            prop="ParentMenuName"
            label="父菜单名称"
            width="160">
          </el-table-column>
          <el-table-column
            prop="OrderByNo"
            label="排列序号"
            width="90">
          </el-table-column>
          <el-table-column
            label="状态"
            width="60">
            <template slot-scope="scope">
              <span v-if="scope.row.RecordStatus == 0"
                    style="color: #f56c6c">禁用</span>
              <span v-else-if="scope.row.RecordStatus == 1"
                    style="color: #39B6AE">正常</span>
              <!--  <span v-else-if="scope.row.RecordStatus == -1"style="color: #EF6F66">删除</span>-->
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="isPath==2" @click="goEdit(1,scope.row.MenuID)"><i class="fa fa-edit"></i>
              </el-button>
              <el-button type="danger" size="mini" v-if="isPath==2" @click="updateByIDs(1,'启用',scope.row.MenuID)"><i
                class="fa fa-check-circle"></i></el-button>
              <el-button type="danger" size="mini" v-if="isPath==2" @click="updateByIDs(0,'禁用',scope.row.MenuID)"><i
                class="fa fa-ban"></i>
              </el-button>
              <el-button type="danger" size="mini" v-if="isDelPath==4" @click="updateByIDs(-1,'删除',scope.row.MenuID)"><i
                class="fa fa-trash-o "></i></el-button>
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
        PageSize: 30,
        totalCount: 0,
        MenuName: '',
        LinkUrl: '',
        MenuType: '',
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
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = true;
      next();
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        try {
          let config = {
            method: "POST",
            url: baseUrl + "SysApi/GetAdminMenuPagerList",
            data: {
              MenuType: this.MenuType,
              MenuName: this.MenuName,
              LinkUrl: this.LinkUrl,
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
      updateByIDs(Status, name, ID){
        this.$confirm('是否确认' + name + '？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateHandle(Status, ID);
        }).catch(() => {
        });
      },
      updateHandle(Status, ID){
        let RecordIds = [];
        if (ID) {
          RecordIds.push(ID)
        } else {
          this.multipleSelection.map((n) => {
            RecordIds.push(n.MenuID)
          });
        }
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
            url: baseUrl + "SysApi/UpdateAdminMenuStatus",
            data: {
              Ids: RecordIds,
              Status: Status
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.init();
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
        this.init();
      },
      handleSearch(){
        this.PageIndex = 1;
        this.init();
      },
      handleReset(){
        this.MenuName = '';
        this.LinkUrl = '';
        this.MenuType = '';
        this.PageIndex = 1;
        this.init();
      },
      goEdit(isEdit, id) {  //编辑
        if (isEdit == 0) {
          this.$router.push('/MenuAddOrEdit?isEdit=' + isEdit);
        } else {
          this.$router.push('/MenuAddOrEdit?isEdit=' + isEdit + '&id=' + id);
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
