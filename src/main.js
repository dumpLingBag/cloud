import App from './App.vue'
import Vue from 'vue'
import router from './router/router'
import store from './store/store'
import Api from './http/index'
import './directive/directives'
import Url from './interface/url'
import './assets/icon/iconfont.css'
import VueScroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import md5 from 'js-md5'
import permission from './directive/permission/index'
import Message from './utils/message'
import Method from "./interface/method"
import BtnType from "./utils/btnType"
import qs from 'qs'
import Cookie from 'js-cookie'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from "vue-i18n"
import * as common from './utils/common'

import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false
Vue.use(Element)
Vue.use(VueI18n)
Vue.use(VueClipboard)
Vue.use(VueScroll)
Vue.use(permission)
Vue.prototype.$vuescrollConfig = {
    bar: {
        size: '4px',
        hoverStyle: true, // 移入鼠标就显示滚动条
        onlyShowBarOnScroll: false, // 是否只有滚动的时候才显示滚动条
        background: 'hsla(220,4%,58%,.3)'
    }
}

Vue.prototype.$method = Method

Vue.use(Api)
Vue.prototype.$qs = qs
Vue.prototype.$url = Url
Vue.prototype.$common = common
Vue.prototype.$md5 = md5
Vue.prototype.$cookies = Cookie
Vue.prototype.$message = Message
Vue.prototype.$btnType = BtnType

const i18n = new VueI18n({
    locale: 'zh_CN',    // 语言标识
    messages: {
        'zh_CN': require('@/common/lang/zh_CN'),     // 中文语言包
        'en_US': require('@/common/lang/en_US'),    // 英文语言包
        'fr_FR': require('@/common/lang/fr_FR')    // 法文语言包
    }
})

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount("#app")
