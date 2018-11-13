// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "@/styles/reset.css";
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/font-awesome/css/font-awesome.min.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import '@/permission'
import axios from 'axios';
import ElementUI from 'element-ui';
import {baseUrl} from '@/config/env';
import '../static/UE/ueditor.config.js';
import '../static/UE/ueditor.all.min.js';
import '../static/UE/lang/zh-cn/zh-cn.js';
import '../static/UE/ueditor.parse.min.js';

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.prototype.$config={
	'url':baseUrl
}

axios.interceptors.request.use(config => {
    if (window.sessionStorage) {
      let Token = window.sessionStorage.Token;
      if (Token) {
        config.headers["Authorization"] = Token || '';
      } else {
        config.headers["Authorization"] = "";
      }
    }
    return config;
  },
  err => {
    console.error(err);
  }
);

Vue.directive('dbClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      if (!el.disabled) {
        el.disabled = true;
        let timer = setTimeout(() => {
          el.disabled = false;
        }, 3000)
      }
    })
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
	store,
  components: { App },
  template: '<App/>'
})
