<template>
  <div class="left-nav">
    <el-row class="tac">
      <el-col style="width: 204px;">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#282828"
          text-color="#b6b6b6"
          align="left"
          router
          unique-opened
          :default-active="$route.name"
          active-text-color="#ffd04b">
          <!--  <el-submenu index="1">
              <template slot="title">
                <i class="fa fa-user-circle-o" style="margin-right: 10px"></i>
                <span>会员管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/">会员信息管理</el-menu-item>
                <el-menu-item index="Property">会员资产管理</el-menu-item>
                <el-menu-item index="Deposit">提现地址管理</el-menu-item>
                <el-menu-item index="Attestation">身份认证</el-menu-item>
                <el-menu-item index="SafetyLog">安全日志</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="fa fa-credit-card" style="margin-right: 10px"></i>
                <span>货币充值提现管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="DepositPay">货币充值管理</el-menu-item>
                <el-menu-item index="WithdrawAudit">货币提现申请审核</el-menu-item>
                <el-menu-item index="WithdrawalSuccess">货币提现成功查询</el-menu-item>
                <el-menu-item index="WithdrawalFailed">货币提现失败查询</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="fa fa-gg" style="margin-right: 10px"></i>
                <span>委托交易管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="EntrustOrder">委托订单管理</el-menu-item>
                <el-menu-item index="DoneOrder">成交订单管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="fa fa-file-text-o" style="margin-right: 10px"></i>
                <span>内容文档管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="News">新闻公告</el-menu-item>
                <el-menu-item index="Introduction">平台介绍</el-menu-item>
                <el-menu-item index="Help">新手指导</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="fa fa-btc" style="margin-right: 10px"></i>
                <span>加密货币管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="CurrencyConfigExpand">币种介绍</el-menu-item>
                <el-menu-item index="CurrencyConfig">货币基本信息配置</el-menu-item>
                <el-menu-item index="CurrencyDWConfig">货币充值提现配置</el-menu-item>
                <el-menu-item index="CurrencyExchange">加密货币交易配置</el-menu-item>
                <el-menu-item index="MarketTypeList">市场类型管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="fa fa-th-large" style="margin-right: 10px"></i>
                <span>系统配置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="AppList">APP升级模板配置</el-menu-item>
                <el-menu-item index="SiteConfig">网站配置</el-menu-item>
                <el-menu-item index="ServiceConfig">客服配置</el-menu-item>
                <el-menu-item index="SMSEmailConfig">短信邮件接口配置</el-menu-item>
                <el-menu-item index="SMSEmailTPLConfig">短信邮件模板配置</el-menu-item>
                <el-menu-item index="Banner">Banner管理</el-menu-item>
                <el-menu-item index="RoleManage">角色管理</el-menu-item>
                <el-menu-item index="AdminUser">系统管理员</el-menu-item>
                <el-menu-item index="MenuManagement">菜单管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="7">
              <template slot="title">
                <i class="fa fa-th-large" style="margin-right: 10px"></i>
                <span>C2C管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="IssuerOrderList">申诉订单管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>-->
          <template v-for="(item,i) in MenuList">
            <el-submenu :index="item.id">
              <template slot="title">
                <i :class="item.ClassName" style="margin-right: 10px"></i>
                <span>{{item.label}}</span>
              </template>
              <el-menu-item-group>
                <template v-for="(value,i) in item.children">
                  <el-menu-item :index="value.Url" @click="tabMenu(value)">{{value.label}}</el-menu-item>
                </template>
              </el-menu-item-group>
            </el-submenu>
          </template>

        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/babel">
  import bus from "@/assets/bus";
  export default {
    data(){
      return {
        MenuList: [],
        tagsList: []
      }
    },
    created(){
      var self = this;
      self.MenuList = JSON.parse(window.localStorage.getItem('MenuList'))
      var orignalSetItem = localStorage.setItem;
      localStorage.setItem = function (key, newValue) {
        var setItemEvent = new Event("setItemEvent");
        setItemEvent.newValue = newValue;
        setItemEvent.key = key;
        //window.dispatchEvent(setItemEvent);
        orignalSetItem.apply(this, arguments);
      }
      window.addEventListener("setItemEvent", (obj) => {
        if (obj.key == "MenuList") {
          self.MenuList = JSON.parse(obj.newValue)
        }
      });


    },
    mounted(){

    },
    methods: {
      tabMenu(val){
        bus.$emit('newVal',val)
      },
      handleOpen(key, keyPath) {
//        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
//        console.log(key, keyPath);
      }
    },
    components: {}
  }

</script>

<style lang="" scoped>
  .left-nav {
    min-height: calc(100vh - 60px);
    background: rgb(40, 40, 40);
  }
</style>
