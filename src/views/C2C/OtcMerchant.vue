<template>
  <div class="panel">
    <header class="panel-heading">商家信息</header>
    <section style="padding-bottom: 30px; margin-top: 16px;">
      <div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
        >
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
        PageIndex: 1,
        PageSize: 10,
        totalCount: 0,
        isPath: ''
      }
    }, 
    mounted(){
      this.getOrder(); 
    },
    methods: { 
      getOrder(){
        try {
          let config = {
            method: "POST",
            url: baseUrl + "C2C/GetMerchant",
            data:{
              pageIndex:  this.PageIndex,
              pageSize:  this.PageSize
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
      handleSizeChange(val){
        this.PageSize= parseInt(`${val}`);
        this.getOrder();
      },
      handleCurrentChange(val){
        this.PageIndex = val;
        this.getOrder();
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
