/**
 * Created by 520 on 2018/6/11.
 */
//公用方法
import axios from 'axios';
import {Message} from 'element-ui';
import {MessageBox} from 'element-ui';
import {baseUrl} from "@/config/env";
import router from '@/router'

export default  {
  formatData(data) {
    var result = typeof (data);
    if (result == "string") {
      data = JSON.parse(data);
    }
    return data;
  },
  //密码强度验证
  pwdStrong(pwd){
    if (!pwd) return;
    this.number = 1;
    let regNumber = /[\d]/,
      regTxt = /[a-zA-Z]/;
    let regCn = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    /*   regBigTxt = /[A-Z]/;*/
    if (pwd.length >= 6 && pwd.length <= 20) {
      if (regNumber.test(pwd)) {
        this.number++;
      }
      if (regTxt.test(pwd)) {
        this.number++;
      }
      if (regCn.test(pwd)) {
        this.number++;
      }
    }
    return this.number;
  },
  code401Lock: false,
  responesValidate(data){
    let res=data;
    if(typeof res.Status=="undefined"){
  		res = this.formatData(data.data);
  	}
  	if (res.Status !== true) {
      if (res.ErrorCode == "NeedAuth") {
        if (window.localStorage) {
  				localStorage.removeItem('Token');
  				if (this.code401Lock) return false;
  				this.code401Lock = true;
  				MessageBox({
  					title: "提示",
  					message:   res.Msg,
  					confirmButtonText: '去登录',
  					type: "info",
  					showClose: false,
  					callback: (action) => {
              this.code401Lock = false;
              if (action == "confirm") {
  							window.location.href = "/#/Login";
  							// this.code401Lock = false;
  						}
  					}
  				});

  			}
  		}
  		else {
  			Message({
  				showClose: true,
  				duration: 4000,
  				message: res.Msg,
  				type: 'error',
  				center: false
  			});
  		}
  		return false;
  	}
  	return true;
  },
  consoleLog: (ex) => {
    if (window.console) {
      console.log(ex);
    } else {
      window.console = {};
    }
  },
  //判断图片是否为base64
  isBase64(str){
    let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
    return reg.test(str);
  },
  //邮箱
  isEmail(str) {
    if (str.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) return true;
    else return false;
  },
  //邮箱
  isChina(str) {
    if (str.search(/^[a-zA-Z\u4e00-\u9fa5]+$/) != -1) return true;
    else return false;
  },
  getDate(date){
    var date = new Date(date);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
  },
  //微信账号
  isWeixin(str) {
    if (str.search(/^[a-zA-Z0-9_]+$/) != -1) return true;
    else return false;
  },
  //支付宝账号
  isAlipay(str) {
    if (str.search(/^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/) != -1) return true;
    else return false;
  },
  //手机号码
  isPhoneNum(str) {
    if (!str) return;
    let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    return reg.test(str);
    /*    var b = str.substr(0, 1);
     if (b == "1" && str.length == 11) return true;
     else return false;*/
  },
  isCard(str) {
    if (!str) return;
    let reg = /^\d*$/;
    return reg.test(str);
    /*    var b = str.substr(0, 1);
     if (b == "1" && str.length == 11) return true;
     else return false;*/
  },
  //包含字母
  hasLetter(str){
    var regExp = new RegExp("[a-zA-Z]");
    return regExp.test(str);
  },
  //包含特殊字符
  hasOther(str){
    var regExp = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……％&*（）——|{}【】‘；：”“'。，、？]");
    return regExp.test(str);
  },
  //包含中文
  hasChinese(str){
    var regExp = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return regExp.test(str);
  },
  //身份证
  isCardID(str){
    if (!str) return;
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return reg.test(str);
  },
  RegExps: {
    isNumber(str){
      let reg = /^\d+(\.\d+)?$/;
      return reg.test(str);
    }
  },
  //获取国家列表
  getCountryList(callback){
    try {
      axios({
        method: "POST",
        url: baseUrl + "",
        data: {}
      }).then((result) => {
        console.log(result);
      });
    } catch (ex) {
      this.consoleLog(ex);
    }
  },
  //获取验证码
  getImgCode(callback){
    try {
      let url = baseUrl + '/common/getcaptcha';
      let config = {
        method: "POST",
        url: url + "?r=" + Math.random(),
        params: {
          // type: type || "Login"
        }
      };
      axios(config).then((result) => {
        if (this.responesValidate(result)) {
          if (callback) {
            callback(result.data);
          }
        }
      });
    } catch (ex) {
      this.consoleLog(ex);
    }
  },
  /*获取用户信息*/
  getUserInfo(){
    let userInfo = "";
    if (window.localStorage) {
      if (window.localStorage.getItem("UserInfo")) {
        userInfo = JSON.parse(window.localStorage.getItem("UserInfo"));
      }
    }
    return userInfo;
  },
  /*2017-07-31 8:00*/
  formatDate (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s;
  },
  getPath(path){
    var self = this;
    let RoleMenuList = JSON.parse(window.localStorage.getItem('RoleMenuList'));
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
        RoleMenuList = JSON.parse(obj.newValue)
      }
    });
    // let flag = false;
    for (var i = 0; i < RoleMenuList.length; i++) {
      if (RoleMenuList[i].MenuUrl.indexOf(path)!=-1) {
        // flag = true;
        // break;
        return RoleMenuList[i].PermissionValue;
      }

    }
  }
}
