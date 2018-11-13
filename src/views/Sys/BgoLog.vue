<template>
  <div class="panel">
    <header class="panel-heading">后台操作日志</header>
    <section style="padding-bottom: 30px;">
      <div class="block" style="margin-top: 10px;">
        <span class="demonstration">操作时间从：</span>
        <el-date-picker v-model="Begin" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>
        <span class="demonstration">到：</span>
        <el-date-picker v-model="End" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"></el-date-picker>

          <el-select v-model="Type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
      <div class="block" style="margin-top: 16px;">
        <label>菜单名称：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="Menu"></el-input>
        <label>管理员名：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="AdminUser"></el-input>
        <label>关键字：</label>
        <el-input style="width:160px;" placeholder="请输入内容" v-model="KeyStr"></el-input>
        <el-button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</el-button>
        <el-button type="success" @click="handleReset">重置</el-button>
      </div>
      <div>
        <el-table
          width="100%"
          :data="tableData">
          <el-table-column
            prop="Menu"
            label="菜单名称"
            width="200">
          </el-table-column>

          <el-table-column
            label="类型"
            prop="TypeName"
            width="150">
          </el-table-column>

          <el-table-column
            prop="UserName"
            label="用户"
            width="150">
          </el-table-column>

          <el-table-column
            label="内容"
            width="850">
            <template slot-scope="scope">
             <a href="javascript:void (0)"  @click="goDetail(scope.row.Id)" v-text="scope.row.Description"></a>
            </template>
          </el-table-column>

          <el-table-column
            prop="CreateTime"
            label="创建时间"
            width="170">
          </el-table-column>

          <el-table-column
            label="操作"  width="100">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="goDetail(scope.row.Id)">查看</el-button>
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
        Begin: '',
        End: '',
        id:'',
        Menu: '',
        AdminUser: '',
        Type: '',
        TypeName: '',
        KeyStr: '',
        tableData: [],
        multipleSelection: [],
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
        isPath:'',
        isAddPath:'',
        isDelPath:'',
        options: [{
          value: 0,
          label: '添加'
        },{
          value: 1,
          label: '修改'
        },{
          value: 2,
          label: '删除'
        },{
          value: 3,
          label: '禁用'
        },{
          value: 4,
          label: '启用'
        },],
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
    mounted(){
      this.getBGoLog();
    },
    methods: {
      getBGoLog(){
        if (this.Begin > this.End) {
          this.$message({
            type: "error",
            message: "开始时间不能大于结束时间!",
          });
          return false;
        }
        try {
          let config = {
            method: "POST",
            url: baseUrl + "BGOLog/QueryBGOLog",
            data: {
            Menu: this.Menu,
            Type: this.Type,
            AdminUser: this.AdminUser,
            KeyStr: this.KeyStr,
            Begin: this.Begin,
            End: this.End,
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
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getBGoLog();
      },
      handleSearch(){
        this.PageIndex = 1;
        this.getBGoLog();
      },
      handleReset(){
        this.Begin = '';
        this.End = '';
        this.Type = '';
        this.Menu = '';
        this.AdminUser = '';
        this.KeyStr = '';
        //this.ruleForm.EmailNumber = '';
        this.getBGoLog();
      },
      goDetail(id) {  //查看
          this.$router.push('/BgoLogDetail?id=' + id);
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
