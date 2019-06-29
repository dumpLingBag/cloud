import apiList from '../interface/index'

const install = Vue => {
  if (install.installed) {
    return
  }
  install.installed = true

  Object.defineProperties(Vue.prototype, {
    $api: {
      get () {
        return apiList
      }
    }
  })
}

export default install
