import getRequest from '@/interface/index'

const initMenu = (router, store) => {
    if (store.state.menuList.length > 0) {
        return false
    }
    getRequest.request('authority/system/listForMenu').then(res => {
        if (res && res.code === 0) {
            if (res.data && res.data.menuList && res.data.menuList.length > 0) {
                store.dispatch('initMenuList', res.data);
                const fmRoutes = formatRoutes(res.data.menuList);
                router.addRoutes(fmRoutes)
            } else {
                // 没有菜单则跳转到登录页
                router.push('/login')
            }
        }
    })
};

let fmRoutes = [
    {
        path: '/',
        name: '主视图',
        component: resolve => require(['@/views/Index.vue'], resolve),
        meta: {title: '主视图', auth: true, keepAlive: true},
        children: [
            {
                path: '/main',
                name: '首页',
                component: resolve => require(['@/views/Main.vue'], resolve),
                meta: {title: '首页', auth: true, keepAlive: true}
            },
            {
                path: '/user_info',
                name: '用户中心',
                component: resolve => require(['@/views/other/UserInfo.vue'], resolve),
                meta: {title: '用户中心', auth: true, keepAlive: true}
            },
            {
                path: '/message',
                name: '消息中心',
                component: resolve => require(['@/views/other/Message.vue'], resolve),
                meta: {title: '消息中心', auth: true, keepAlive: true}
            },
            {
                path: '/dictionary_data/:dictType',
                name: '字典数据',
                component: resolve => require(['@/views/system/DictionaryData.vue'], resolve),
                meta: {title: '字典数据', auth: true, keepAlive: true}
            },
            {
                path: '/message/release',
                name: '发布消息',
                component: resolve => require(['@/components/tinymce/Tinymce'], resolve),
                meta: {title: '发布消息', auth:  true, keepAlive: true}
            }
        ]
    }
];

const formatRoutes = (routes) => {
    if (routes && routes.length > 0) {
        for (let i = 0; i < routes.length; i++) {
            setRoutes(routes[i])
        }
    }
    return fmRoutes
};

const routers = (route) => {
    return {
        path: route.path + '/' + url(route.component),
        component: resolve => require(['@/views' + route.path + '/' + route.component + '.vue'], resolve),
        name: route.name,
        icon: route.icon,
        meta: route.meta,
        children: route.children
    }
};

const setRoutes = (routes) => {
    let children = routes.children;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child && child.component) {
                fmRoutes[0].children.push(routers(child))
            }
            if (child && child.children) {
                setRoutes(child)
            }
        }
    } else {
        fmRoutes[0].children.push(routers(routes))
    }
};

const url = (component) => {
    if (component) {
        component = component.replace(component[0], component[0].toLowerCase());
        return component.replace(/([A-Z])/g, '-$1').toLowerCase()
    }
};

export default {
    initMenu,
    formatRoutes
}