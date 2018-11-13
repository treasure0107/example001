<template>
  <div class="panel">
    <header class="panel-heading">订单申诉详情</header>
    <section>
      <el-form ref="form" :model="form" label-width="200px" class="form">
        <el-form-item label="订单编号：" prop="name"><span>{{form.OrderId}}</span></el-form-item>
        <el-form-item label="交易类型：" prop="name">
          <span v-if="form.Tradetype == 'Buy'" style="color: #39B6AE">买单</span>
          <span v-if="form.Tradetype == 'Sell'" style="color: #EF6F66">卖单</span>
        </el-form-item> 
           <el-form-item label="申诉类型：" prop="name">
          <span>{{form.Tradetype == 'Buy'?(form.UserId==form.IssueUserId?"买方申诉":"卖方申诉"):(form.UserId!=form.IssueUserId?"买方申诉":"卖方申诉")}}</span>
        </el-form-item>
        <el-form-item label="货币单位：" prop="name">
          <span>{{form.CoinUnit}}</span>
        </el-form-item>
        <el-form-item label="交易数量：" prop="OrderByNo">
          <span>{{form.Volume}}</span>
        </el-form-item>
        <el-form-item label="支付方式：" prop="OrderByNo">
          <span v-if="form.PayType == 'Bank'">银行卡</span>
          <span v-else-if="form.PayType == 'AliPay'">支付宝</span>
          <span v-else>不限</span>
        </el-form-item>
        <el-form-item label="下单时间：" prop="OrderByNo">
          <span>{{form.CreateTime}}</span>
        </el-form-item>
        <el-form-item>
          <div class="clearFix">
            <div class="complaining-party">
              <p class="tit">申诉方
               ({{Accuser.UserId}}) 
               
               ({{form.Tradetype == 'Buy'?(form.UserId==Accuser.UserId?"买方":"卖方"):(form.UserId!=Accuser.UserId?"买方":"卖方")}}) 
             
                </p> 
              
              <p class="con">昵称：<span>{{Accuser.NickName}}</span></p>
              <p class="con">姓名：<span>{{Accuser.FullName}}</span></p>
              <p class="con">手机号：<span>{{Accuser.PhoneNumber}}</span></p>
              <p class="con">申诉类型：<span>{{Accuser.IussueType}}</span></p>
              <div class="con">申诉说明：<span>{{Accuser.Remarke}}</span></div>
              <div class="con">图片：
                <ul>
                  <li v-for="item in Accuser.BizIussueImg">
                    <span @click="ImgBtn(item)"><img :src="item"></span>
                  </li>
                </ul>
              </div>
              <p class="btn">
                <el-button type="primary" v-if="Accuser.IussueId>0" @click="submitForm(Accuser.IussueId,Accuser.UserId,1)">胜诉</el-button> 
                 <el-button type="primary" v-if="Accused.IussueId==0" @click="submitForm(Accuser.IussueId,Accuser.UserId,0)">败诉</el-button> 
              </p>
            </div>
            <div class="complaining-party">
              <p class="tit">被申诉方   
              </p>
              <div v-if="isShow">
                 
                <p class="con">昵称：<span>{{Accused.NickName}}</span></p>
                <p class="con">姓名：<span>{{Accused.FullName}}</span></p>
                <p class="con">手机号：<span>{{Accused.PhoneNumber}}</span></p>
                <p class="con">申诉类型：<span>{{Accused.IussueType}}</span></p>
                <div class="con">申诉说明：<span>{{Accused.Remarke}}</span></div>
                <div class="con">图片：
                  <ul>
                    <li v-if="Accused.BizIussueImg == null" style="font-size:40px;color:red;text-align:center;">被申诉方未上传凭证</li>
                    <li v-else v-for="item in Accused.BizIussueImg">
                      <span @click="ImgBtn(item)"><img :src="item"></span>
                    </li>
                  </ul>
                </div>
                <p class="btn">
                <el-button type="primary" v-if="Accused.IussueId>0" @click="submitForm(Accused.IussueId,Accused.UserId,1)">胜诉</el-button>
              
          
                </p>
              </div>
              <div v-if="!isShow" style="text-align: center;font-size: 18px;">
                没有上传资料
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <!--图片弹窗-->
      <div>
        <el-dialog width="500px" :visible.sync="dialogVisible" :before-close="clearContent">
          <div style="text-align: center;padding: 60px 0;">
            <a :href="srcUrl" target="_blank">
            <img :src="srcUrl" alt="" ref="rotateImg" style="width: 300px;">
            </a>
          </div>
          <footer slot="footer" class="dialog-footer">
            <el-button type="primary" @click="rotateBtn">旋转</el-button>
            <el-button type="danger" @click="closeBtn">关闭</el-button>
          </footer>
        </el-dialog>
      </div>
    </section>
  </div>
</template>
<script type="text/babel">
import until from "@/scripts/until";
import { baseUrl } from "@/config/env";
export default {
  data() {
    return {
      id: 0,
      isShow: true,
      form: {},
      Accuser: {
        UserName: "",
        IussueType: "",
        Remarke: "",
        IussueId: 0,
        BizIussueImg: [],
        UserId:0
      },
      Accused: {UserName: "",
        IussueType: "",
        Remarke: "",
        IussueId: 0,
        BizIussueImg: [],
        UserId:0},
      AccuserObj: {
        OrderId: 0,
        IussueId: 0,
        UserId:0,
        IussueStatus: -1
      },
      AccusedObj: {},
      arr: [],
      dialogVisible: false,
      srcUrl: "",
      current: 0,
      buyerUserId:0,
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      try {
        let config = {
          method: "GET",
          url: baseUrl + "C2C/GetIussuerInfo?orderId=" + this.id
        };
        this.$axios(config).then(res => {
         
          if (until.responesValidate(res)) {
            this.form = res.data.Data;
            this.buyerUserId=this.form.Tradetype == 'Buy'?this.form.userId:this.form.MerchantUserId;
            if (res.data.Data.Accuser) {
              this.Accuser = res.data.Data.Accuser;
              this.AccuserObj.OrderId = this.id;
              this.AccuserObj.IussueId = this.Accuser.IussueId;
              this.arr.push(this.AccuserObj);
            }
            if (res.data.Data.Accused) {
              this.isShow = true;
              this.Accused = res.data.Data.Accused;
              this.AccusedObj.OrderId = this.id;
              this.AccusedObj.IussueId = this.Accused.IussueId;
              this.arr.push(this.AccusedObj);
            } else {
              this.isShow = false;
            }
          };
         
                 
        });
      } catch (ex) {
        until.consoleLog(ex);
      }
    },
    submitForm(IssueId,Userid, IussueStatus) {
      // if (appeal == 0) {
      //   this.AccuserObj.IussueStatus = IussueStatus;
      // }
      // if (appeal == 1) {
      //   this.AccusedObj.IussueStatus = IussueStatus;
      // }
      try {
        let config = {
          method: "POST",
          url: baseUrl + "C2C/SaveIssueStatus",
          data: {
            "IussueId": IssueId,
   "IussueStatus": IussueStatus,
   "userId":Userid,
"OrderId": this.id
          }
        };
        this.$axios(config).then(res => {
          if (until.responesValidate(res)) {
            this.$message({
              type: "success",
              duration: 1000,
              message: res.data.msg || "操作成功！",
              onClose: () => {
                this.$router.push("/IssuerOrderList");
              }
            });
          }
        });
      } catch (ex) {
        until.consoleLog(ex);
      }
    },
    ImgBtn(url) {
      this.current = 0;
      if (url) {
        this.srcUrl = url;
        this.dialogVisible = true;
      }
    },
    rotateBtn() {
      this.current = (this.current + 90) % 360;
      this.$refs.rotateImg.style.transform = "rotate(" + this.current + "deg)";
    },
    clearContent() {
      this.dialogVisible = false;
      this.current = 0;
      this.$refs.rotateImg.style.transform = "rotate(" + this.current + "deg)";
    },
    closeBtn() {
      this.clearContent();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.form {
  margin-top: 30px;
  padding-bottom: 30px;
}

.complaining-party {
  width: 600px;
  min-height: 690px;
  border: 1px solid #ccc;
  float: left;
  margin-right: 30px;
  font-size: 14px;
  position: relative;
  .tit {
    font-size: 18px;
    text-align: center;
    color: #000;
  }
  .con {
    padding: 5px 10px;
    span {
      color: #606266;
    }
    img {
      height: 100px;
    }
  }
  .btn {
    position: absolute;
    bottom: 6px;
    right: 10px;
  }
}
</style>
