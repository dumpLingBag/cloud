export default {
  Login: {
    /* 登录 */
    login: 'authority/authorityLogin/login',
    /* 登出 */
    loginOut: 'authority/authorityLogin/loginOut'
  },
  AuthorityUser: {
    /* 添加用户 */
    addUser: 'authority/user/save',
    /* 修改用户 */
    editUser: 'authority/user/update',
    /* 获取用户信息 */
    pageList: 'authority/user/pageList',
    /* 重置密码${id} */
    resetPassword: 'authority/user/reset',
    /* 启用禁用账号${id}/${enable} */
    enable: 'authority/user/enable',
    delete: 'authority/user/delete'
  },
  IconList: {
    /* 加载图标 */
    loadIcon: 'authority/authoritySys/loadIcon'
  },
  User: {
    updatePassword: 'authority/user/updatePassword',
    checkPassword: 'authority/user/checkPassword'
  },
  AuthorityMenu: {
    /* 加载地址url */
    load: 'authority/authorityMenu/load',
    save: 'authority/authorityMenu/save',
    update: 'authority/authorityMenu/update',
    delete: 'authority/authorityMenu/delete',
    loadByPid: 'authority/authorityMenu/loadByPid',
    updateInList: 'authority/authorityMenu/updateInList'
  },
  AuthorityMenuUrl: {
    load: 'authority/authorityMenuUrl/load',
    loadUrl: 'authority/authorityMenuUrl/loadUrl',
    update: 'authority/authorityMenuUrl/update'
  },
  AuthorityRole: {
    load: 'authority/authorityRole/load',
    save: 'authority/authorityRole/save',
    update: 'authority/authorityRole/update',
    delete: 'authority/authorityRole/delete',
    loadByPid: 'authority/authorityRole/loadByPid'
  },
  AuthorityRoleMenu: {
    load: 'authority/authorityRoleMenu/load',
    loadMenu: 'authority/authorityRoleMenu/loadMenu',
    update: 'authority/authorityRoleMenu/update'
  },
  AuthorityUserRole: {
    load: 'authority/authorityUserRole/load',
    update: 'authority/authorityUserRole/update'
  },
  AuthorityCommonUrl: {
    load: 'authority/authorityCommonUrl/load',
    update: 'authority/authorityCommonUrl/update',
    loadOpen: 'authority/authorityCommonUrl/loadOpen'
  },
  Message: {
    load: 'authority/message/load'
  },
  Notice: {
    getUser: 'authority/socket/getUser',
    kickOut: 'authority/socket/kickOut',
    sendUser: 'authority/socket/sendUser',
    banned: 'authority/socket/banned'
  }
}
