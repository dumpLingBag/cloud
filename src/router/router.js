import Vue from 'vue'
import Router from 'vue-router'
import Cookie from "js-cookie";
import MenuUtil from "@/utils";
import store from "@/store/store";

Vue.use(Router)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['@/views/Login'], resolve),
        meta: {title: '登录'}
    }
];

// 实例化
const router = new Router({
    mode: 'history', // 把hash模式改成history nginx location / {try_files $uri $uri/ /index.html;}
    base: process.env.BASE_URL,
    routes // (缩写)相当于 routes: routes
});

router.beforeEach((to, from, next) => {
    if (to.name) {
        document.title = to.meta.title
    }
    if (to.path === '/login') {
        next()
    } else {
        if (Cookie.get('access_token')) {
            MenuUtil.initMenu(router, store);
            next()
        } else {
            router.push('/login');
            next()
        }
    }
});

export default router
