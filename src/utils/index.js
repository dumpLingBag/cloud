import getRequest from '@/interface/index'

export const initMenu = (router, store) => {
  if (store.state.menuList.length > 0) {
    return false
  }
  getRequest.httpGet('authoritySys/loadForMenu').then(res => {
    if (res && res.code === 0) {
      const fmRoutes = formatRoutes(res.data)
      router.addRoutes(fmRoutes)
      store.dispatch('initMenuList', res.data)
    }
  })
}

let fmRoutes = [
  {
    path: '/',
    name: '主视图',
    component: resolve => require(['@/views/Index.vue'], resolve),
    meta: { title: '主视图', auth: true, keepAlive: true },
    children: [
      {
        path: '/main',
        name: '首页',
        component: resolve => require(['@/views/Main.vue'], resolve),
        meta: { title: '首页', auth: true, keepAlive: true }
      },
      {
        path: '/user_info',
        name: '用户中心',
        component: resolve => require(['@/views/other/UserInfo.vue'], resolve),
        meta: { title: '用户中心', auth: true, keepAlive: true }
      },
      {
        path: '/message',
        name: '消息中心',
        component: resolve => require(['@/views/other/Message.vue'], resolve),
        meta: { title: '消息中心', auth: true, keepAlive: true }
      }
    ]
  }
]

const formatRoutes = (routes) => {
  if (routes && routes.length > 0) {
    for (let i = 0; i < routes.length; i++) {
      setRoutes(routes[i])
    }
  }
  return fmRoutes
}

const routers = (route) => {
  return {
    path: route.path + '/' + url(route.component),
    component: resolve => require(['@/views' + route.path + '/' + route.component + '.vue'], resolve),
    name: route.name,
    icon: route.icon,
    meta: route.meta,
    children: route.children
  }
}

const setRoutes = (routes) => {
  let children = routes.children
  if (children && children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      if (children[i].component) {
        fmRoutes[0].children.push(routers(children[i]))
      }
      if (children[i].children.length > 0) {
        setRoutes(children[i])
      }
    }
  } else {
    fmRoutes[0].children.push(routers(routes))
  }
}

const url = (component) => {
  if (component) {
    component = component.replace(component[0], component[0].toLowerCase())
    return component.replace(/([A-Z])/g, '_$1').toLowerCase()
  }
}
