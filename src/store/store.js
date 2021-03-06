//const Vuex = require('vuex');
//const Cookies = require('js-cookie');
//const menuUtil = require('../utils/index').default;
//const router = require('../router/router').default;
//const hump = require('../utils/humpToLine');
import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import menuUtil from '@/utils'
import router from '@/router/router'
import { toHump } from '@/utils/common'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        menuList: [],
        initFlag: true,
        collapse: false,
        tagsTop: true,
        innerHeight: window.innerHeight,
        tagList: [],
        visitedViews: [],
        permissions: [],
        roles: [],
        avatar: '',
        nickname: ''
    },
    mutations: {
        LOGIN(state, user) {
            Cookies.set('access_token', user.access_token, {expires: 7});
            Cookies.set('avatar', user.avatar, {expires: 7});
            Cookies.set('nickname', user.nickname, {expires: 7});
            Cookies.set('uid', user.userId, {expires: 7});
            Cookies.set('checked', user.checked, {expires: 7});
            state.permissions = user.authorities;
            let fmRoutes = menuUtil.formatRoutes(user.menuList);
            router.addRoutes(fmRoutes);
            state.menuList = user.menuList
        },
        LOGIN_OUT(state) {
            Cookies.remove('access_token');
            Cookies.remove('avatar');
            Cookies.remove('nickname');
            Cookies.remove('uid');
            Cookies.remove('checked');
            state.menuList = [];
            state.visitedViews = []
        },
        INIT_FLAG(state, initFlag) {
            state.initFlag = initFlag
        },
        INIT_MENU_LIST(state, menuAuth) {
            state.menuList = menuAuth.menuList;
            state.permissions = menuAuth.authorities
        },
        COLLAPSE(state, collapse) {
            state.collapse = collapse
        },
        TAGS_TOP(state, tagsTop) {
            state.tagsTop = tagsTop
        },
        INNER_HEIGHT(state, height) {
            state.innerHeight = height
        },
        ADD_VISITED_VIEWS: (state, view) => {
            if (state.visitedViews.some(v => v.path === view.fullPath)) {
                return;
            }
            state.visitedViews.push({
                name: view.name,
                path: view.path,
                title: view.meta.title || 'no-name'
            });
            if (view.meta.keepAlive === '1') {
                let path = view.path.split('/');
                state.tagList.push(toHump(path[path.length - 1]))
            }
        },
        DEL_VISITED_VIEWS: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews.splice(i, 1);
                    state.tagList.splice(i, 1);
                    break
                }
            }
        },
        DEL_OTHERS_VIEWS: (state, view) => {
            state.visitedViews = state.visitedViews.filter(item => {
                return item.path === view.fullPath
            });
            state.tagList = state.tagList.filter(item => {
                let path = view.path.split('/');
                return item === toHump(path[path.length - 1])
            })
        },
        DEL_ALL_VIEWS: (state) => {
            state.visitedViews = [];
            state.tagList = []
        },
        UPDATE_USER: (state, user) => {
            state.nickname = user.nickname
        },
        UPDATE_AVATAR: (state, avatar) => {
            state.avatar = avatar;
            let userAvatar = Cookies.get('avatar');
            if (!userAvatar) {
                Cookies.set('avatar', avatar, {expires: 7})
            }
        }
    },
    actions: {
        login({commit}, user) {
            commit('LOGIN', user)
        },
        loginOut({commit}) {
            commit('LOGIN_OUT')
        },
        initMenuList({commit}, menuList) {
            commit('INIT_MENU_LIST', menuList)
        },
        initFlag({commit}, flag) {
            commit('INIT_FLAG', flag)
        },
        collapse({commit}, collapse) {
            commit('COLLAPSE', collapse)
        },
        tagsTop({commit}, tagsTop) {
            commit('TAGS_TOP', tagsTop)
        },
        innerHeight({commit}, height) {
            commit('INNER_HEIGHT', height)
        },
        addVisitedViews({commit}, view) {
            commit('ADD_VISITED_VIEWS', view)
        },
        delVisitedViews({commit, state}, view) {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view);
                resolve([...state.visitedViews])
            })
        },
        delOthersViews({commit, state}, view) {
            return new Promise((resolve) => {
                commit('DEL_OTHERS_VIEWS', view);
                resolve([...state.visitedViews])
            })
        },
        delAllViews({commit, state}) {
            return new Promise((resolve) => {
                commit('DEL_ALL_VIEWS');
                resolve([...state.visitedViews])
            })
        },
        updateUser({commit, state}, user) {
            return new Promise((resolve) => {
                commit('UPDATE_USER', user);
                resolve([...state.visitedViews])
            })
        },
        updateAvatar({commit, state}, avatar) {
            return new Promise((resolve) => {
                commit('UPDATE_AVATAR', avatar);
                resolve([...state.visitedViews])
            })
        }
    }
})
