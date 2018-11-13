<template>
  <div class="panel">
    <header class="panel-heading">支付宝账号审核</header>
    <section style="padding-bottom: 30px; margin-top: 16px;">
      <div class="block" style="margin: 30px 0;">
        <label>审核状态：</label>
        <el-select style="width:300px;" v-model="AlipayStatus" placeholder="全部">
          <el-option label="全部" value=""></el-option>
          <el-option label="审核中" value="0"></el-option>
          <el-option label="审核通过" value="1"></el-option>
          <el-option label="审核失败" value="-1"></el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch" style="margin-left: 30px;">搜索</el-button>
        <el-button type="success" @click="refresh">刷新</el-button>
      </div>
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            prop="TrueName"
            label="用户姓名"
            width="130">
          </el-table-column>
          <el-table-column
            prop="UserName"
            label="用户昵称"
            width="160">
          </el-table-column>
          <el-table-column
            prop="AlipayIImg"
            label="支付宝收款图片地址"
            width="160">
            <template slot-scope="scope">
              <span @click="ImgBtn(scope.row.AlipayIImg)">
                <img :src="scope.row.AlipayIImg" style="height: 30px;">
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="AlipayAccount"
            label="支付宝账号"
            width="260">
          </el-table-column>
          <el-table-column
            prop="Alipaymobile"
            label="账号绑定的手机号"
            width="160">
          </el-table-column>
          <el-table-column
            label="支付宝账号审核状态"
            width="190">
            <template slot-scope="scope">
              <span v-if="scope.row.AlipayStatus == 0"
                    style="color: #6dbb4a">审核中</span>
              <span v-else-if="scope.row.AlipayStatus == 1"
                    style="color: #39B6AE">审核通过</span>
              <span v-else-if="scope.row.AlipayStatus == -1"
                    style="color: #EF6F66">审核失败</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            width="390">
            <template slot-scope="scope">
              <span class="remark-h">{{scope.row.Remark}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="210">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" v-if="isPath==2&&scope.row.AlipayStatus!=0" @click="goEdit(scope.row.Id)">编辑</el-button>
              <el-button type="success" size="mini" @click="updateByIDs(1,scope.row.Id,'审核通过')"
                         v-if="isPath==2&&scope.row.AlipayStatus==0">
                审核通过
              </el-button>
              <el-button type="warning" size="mini" @click="updateByIDs(-1,scope.row.Id ,'审核失败')"
                         v-if="isPath==2&&scope.row.AlipayStatus==0">
                审核失败
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--弹窗-->
      <div>
        <el-dialog width="500px" :visible.sync="dialogVisible" :before-close="clearContent">
          <div style="text-align: center;padding: 30px 0;">
            <img :src="srcUrl" alt="" ref="rotateImg" style="width: 300px;">
          </div>
          <footer slot="footer" class="dialog-footer">
            <el-button type="primary" @click="rotateBtn">旋转</el-button>
            <el-button type="danger" @click="closeBtn">关闭</el-button>
          </footer>
        </el-dialog>
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
  import {MessageBox} from 'element-ui';
  export default {
    data(){
      return {
        tableData: [],
        multipleSelection: [],
        AlipayStatus: '',
        dialogVisible: false,
        srcUrl: '',
        current: 0,
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
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
      this.getOrder();
      document.onkeydown=e=>{
        let _key=window.event.keyCode;
        if(_key===13){
          this.handleSearch();
        }
      }
    },
    methods: {
      goEdit(id){
        this.$router.push('/AlipayAuditEdit?id=' + id);
      },
      ImgBtn(url){
        if (url) {
          this.srcUrl = url;
          this.dialogVisible = true;
        }
      },
      rotateBtn(){
        this.current = (this.current + 90) % 360;
        this.$refs.rotateImg.style.transform = 'rotate(' + this.current + 'deg)';
      },
      clearContent(){
        this.dialogVisible = false;
        this.current = 0;
        this.$refs.rotateImg.style.transform = 'rotate(' + this.current + 'deg)';
      },
      closeBtn(){
        this.clearContent();
      },
      refresh(){
        this.AlipayStatus = ''
        this.PageIndex=1
        this.getOrder()
      },
      getOrder(){
        try {
          let config = {
            method: "POST",
            url: baseUrl + "C2C/GetAlipayAuditPageList",
            data: {
              AlipayStatus: this.AlipayStatus,
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
      handleSearch(){
        this.PageIndex = 1;
        this.getOrder();
      },
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getOrder();
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getOrder();
      },
      updateByIDs(Status, ID, name){
        this.$confirm('是否' + name + '选择的数据？', '提示', {
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
          RecordIds.push(ID);
        } else {
          this.multipleSelection.map((n) => {
            RecordIds.push(n.ID);
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
            url: baseUrl + "C2C/UpdateStatusByIds",
            data: {
              Ids: RecordIds,
              Status: Status
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.getOrder();
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
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
      margin-bottom: 10px;
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

  .el-button {
    padding: 9px 20px;
  }

  /deep/ .el-table .cell {
    text-align: center;
  }

  .el-button {
    padding: 9px 20px;
  }

  .el-button--mini, .el-button--mini.is-round {
    padding: 4px 9px;
    margin-left: 0;
  }

  .remark-h {
    display: inline-block;
    width: 390px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
