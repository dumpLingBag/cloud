import App from './App.vue'
import router from './router/router'
import store from './store/store'
import api from './http/index'
import { initMenu } from './utils/index'
import './utils/directives'
import url from './interface/url'
import toolUtil from './utils/toolUtil'
import Common from './utils/common'
import time from './utils/timeUtil'
import './assets/icon/iconfont.css'

const VueClipboard = require('vue-clipboard2')
const Vue = require('vue')
const qs = require('qs')
const echarts = require('echarts')

Vue.config.productionTip = false;
Vue.use(store)
Vue.use(VueClipboard);
Vue.prototype.$vuescrollConfig = {
    bar: {
        size: '4px',
        hoverStyle: true, // 移入鼠标就显示滚动条
        onlyShowBarOnScroll: false, // 是否只有滚动的时候才显示滚动条
        background: 'hsla(220,4%,58%,.3)'
    }
}

Vue.use(api);
Vue.prototype.$qs = qs;
Vue.prototype.$url = url;
Vue.prototype.$toolUtil = toolUtil;
Vue.prototype.$common = Common;
Vue.prototype.$time = time;
Vue.prototype.$echarts = echarts;

router.beforeEach((to, from, next) => {
    if (to.name) {
        document.title = to.meta.title
    }
    if (to.path === '/login') {
        next()
    } else {
        if (localStorage.getItem('token')) {
            if (store.state.initFlag) {
                initMenu(router, store);
                store.dispatch('initFlag', false)
            }
            next()
        } else {
            router.push('/login')
        }
    }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
