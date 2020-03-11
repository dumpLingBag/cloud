import App from './App.vue'
import router from './router/router'
import store from './store/store'
import api from './http/index'
import menuUtil from './utils/index'
import './directive/directives'
import url from './interface/url'
import toolUtil from './utils/toolUtil'
import Common from './utils/common'
import time from './utils/timeUtil'
import pass from './utils/password'
import './assets/icon/iconfont.css'
import VueScroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import md5 from 'js-md5'
import './directive/permission/index'
import { Notification } from 'element-ui';

const VueClipboard = require('vue-clipboard2')
const Vue = require('vue')
const qs = require('qs')
const echarts = require('echarts')
const cookie = require('js-cookie')

Vue.config.productionTip = false;
Vue.use(store)
Vue.use(VueClipboard);
Vue.use(VueScroll)
Vue.prototype.$vuescrollConfig = {
    bar: {
        size: '4px',
        hoverStyle: true, // 移入鼠标就显示滚动条
        onlyShowBarOnScroll: false, // 是否只有滚动的时候才显示滚动条
        background: 'hsla(220,4%,58%,.3)'
    }
}

Vue.prototype.$method = {
    'get': 'GET',
    'post': 'POST',
    'delete': 'DELETE',
    'put': 'PUT'
}

Vue.use(api);
Vue.prototype.$qs = qs;
Vue.prototype.$url = url;
Vue.prototype.$toolUtil = toolUtil;
Vue.prototype.$common = Common;
Vue.prototype.$time = time;
Vue.prototype.$echarts = echarts;
Vue.prototype.$md5 = md5;
Vue.prototype.$cookies = cookie;
Vue.prototype.$pass = pass;

router.beforeEach((to, from, next) => {
    if (to.name) {
        document.title = to.meta.title
    }
    if (to.path === '/login') {
        next()
    } else {
        if (cookie.get('access_token')) {
            menuUtil.initMenu(router, store);
            next()
        } else {
            router.push('/login');
            next()
        }
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
