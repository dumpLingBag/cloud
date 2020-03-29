const Router = require('vue-router')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@/views/Login'], resolve),
    meta: { title: '登录' }
  }
];

// 实例化
const router = new Router({
  mode: 'history', // 把hash模式改成history nginx location / {try_files $uri $uri/ /index.html;}
  base: process.env.BASE_URL,
  routes // (缩写)相当于 routes: routes
});

export default router
