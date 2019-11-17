const Vuex = require('vuex')

export default new Vuex.Store({
  state: {
    user: {
      name: window.localStorage.getItem('user') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user')).nickname
    },
    menuList: [],
    initFlag: true,
    collapse: false,
    tagList: [],
    visitedViews: []
  },
  mutations: {
    LOGIN (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    LOGIN_OUT (state) {
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('token')
      state.visitedViews = []
    },
    INIT_FLAG (state, initFlag) {
      state.initFlag = initFlag
    },
    INIT_MENU (state, menuList) {
      state.menuList = menuList
    },
    COLLAPSE (state, collapse) {
      state.collapse = collapse
    },
    TAG_LIST (state, tagList) {
      for (let i = 0; i < tagList.length; i++) {
        state.tagList.push(tagList[i].name)
      }
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.fullPath)) return
      state.visitedViews.push({
        name: view.name,
        path: view.path,
        title: view.meta.title || 'no-name'
      })
      let path = view.path.split('/')
      state.tagList.push(path[path.length - 1])
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          state.tagList.splice(i, 1)
          break
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter(item => {
        return item.path === view.fullPath
      })
      state.tagList = state.tagList.filter(item => {
        let path = view.path.split('/')
        return item === path[path.length - 1]
      })
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.visitedViews = []
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('LOGIN', user)
    },
    loginOut ({ commit }) {
      commit('LOGIN_OUT')
    },
    initMenu ({ commit }, menuList) {
      commit('INIT_MENU', menuList)
    },
    initFlag ({ commit }, flag) {
      commit('INIT_FLAG', flag)
    },
    collapse ({ commit }, collapse) {
      commit('COLLAPSE', collapse)
    },
    addVisitedViews ({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews ({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews ({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
})
