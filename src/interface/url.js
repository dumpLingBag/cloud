export default {
  Login: {
    /* 登录 */
    login: 'authorityLogin/login',
    /* 登出 */
    loginOut: 'authorityLogin/loginOut'
  },
  AuthorityUser: {
    /* 添加用户 */
    addUser: 'user/save',
    /* 修改用户 */
    editUser: 'user/update',
    /* 获取用户信息 */
    pageList: 'user/pageList',
    /* 重置密码${id} */
    resetPassword: 'user/reset',
    /* 启用禁用账号${id}/${enable} */
    enable: 'user/enable',
    delete: 'user/delete'
  },
  IconList: {
    /* 加载图标 */
    loadIcon: 'authoritySys/loadIcon'
  },
  User: {
    updatePassword: 'user/updatePassword',
    checkPassword: 'user/checkPassword'
  },
  AuthorityMenu: {
    /* 加载地址url */
    load: 'authorityMenu/load',
    save: 'authorityMenu/save',
    update: 'authorityMenu/update',
    delete: 'authorityMenu/delete',
    loadByPid: 'authorityMenu/loadByPid'
  },
  AuthorityMenuUrl: {
    load: 'authorityMenuUrl/load',
    loadUrl: 'authorityMenuUrl/loadUrl',
    update: 'authorityMenuUrl/update'
  },
  AuthorityRole: {
    load: 'authorityRole/load',
    save: 'authorityRole/save',
    update: 'authorityRole/update',
    delete: 'authorityRole/delete',
    loadByPid: 'authorityRole/loadByPid'
  },
  AuthorityRoleMenu: {
    load: 'authorityRoleMenu/load',
    loadMenu: 'authorityRoleMenu/loadMenu',
    update: 'authorityRoleMenu/update'
  },
  AuthorityUserRole: {
    load: 'authorityUserRole/load',
    update: 'authorityUserRole/update'
  },
  AuthorityCommonUrl: {
    load: 'authorityCommonUrl/load',
    update: 'authorityCommonUrl/update',
    loadOpen: 'authorityCommonUrl/loadOpen'
  },
  Message: {
    load: 'message/load'
  },
  Notice: {
    getUser: 'socket/getUser',
    kickOut: 'socket/kickOut',
    sendUser: 'socket/sendUser',
    banned: 'socket/banned'
  }
}
