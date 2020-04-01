export default {
    Login: {
        /* 登录 */
        login: 'authority/authorityLogin/login',
        /* 登出 */
        loginOut: 'authority/authorityLogin/loginOut',
        captcha: 'authority/authorityLogin/captcha'
    },
    AuthorityUser: {
        /* 添加用户 */
        addUser: 'authority/user/insert',
        /* 修改用户 */
        editUser: 'authority/user/update',
        /* 获取用户信息 */
        pageList: 'authority/user/page',
        /* 重置密码${id} */
        resetPassword: 'authority/user/reset',
        /* 启用禁用账号${id}/${enable} */
        enabled: 'authority/user/enabled',
        delete: 'authority/user/delete'
    },
    IconList: {
        /* 加载图标 */
        loadIcon: 'authority/system/listIcon'
    },
    User: {
        updatePassword: 'authority/user/updatePassword',
        checkPassword: 'authority/user/checkPassword',
        uploadAvatar: 'authority/user/uploadAvatar'
    },
    AuthorityMenu: {
        /* 加载地址url */
        list: 'authority/menu/list',
        insert: 'authority/menu/insert',
        update: 'authority/menu/update',
        delete: 'authority/menu/delete',
        listByPid: 'authority/menu/listByPid',
        updateInMenu: 'authority/menu/updateInMenu'
    },
    AuthorityMenuUrl: {
        load: 'authority/menuUrl/load',
        loadUrl: 'authority/menuUrl/loadUrl',
        update: 'authority/menuUrl/update'
    },
    AuthorityRole: {
        load: 'authority/role/list',
        loadRole: 'authority/role/listRole',
        save: 'authority/role/insert',
        update: 'authority/role/update',
        delete: 'authority/role/delete',
        loadByPid: 'authority/role/listByPid',
        updateInList: 'authority/role/updateInList'
    },
    AuthorityRoleMenu: {
        load: 'authority/roleMenu/list',
        loadMenu: 'authority/roleMenu/listMenu',
        update: 'authority/roleMenu/update',
        save: 'authority/roleMenu/insert'
    },
    AuthorityUserRole: {
        load: 'authority/userRole/list',
        update: 'authority/userRole/update',
        save: 'authority/userRole/insert',
        loadUserByRoleId: 'authority/userRole/pageUserByRoleId'
    },
    AuthorityCommonUrl: {
        load: 'authority/commonUrl/list',
        update: 'authority/commonUrl/update',
        loadOpen: 'authority/commonUrl/listOpen'
    },
    Message: {
        load: 'authority/message/load'
    },
    Notice: {
        getUser: 'authority/socket/getUser',
        kickOut: 'authority/socket/kickOut',
        sendUser: 'authority/socket/sendUser',
        banned: 'authority/socket/banned'
    },
    Log: {
        loginInfo: 'authority/log/loginInfo',
        operation: 'authority/log/operation'
    },
    File: {
        upload: 'authority/file/upload'
    },
    DictType: {
        loadDictType: 'authority/dictType/page',
        list: 'authority/dictType/list',
        save: 'authority/dictType/insert',
        update: 'authority/dictType/update',
        delete: 'authority/dictType/delete',
        getDictType: 'authority/dictType/getDictType'
    },
    DictData: {
        loadDictData: 'authority/dictData/list',
        save: 'authority/dictData/insert',
        update: 'authority/dictData/update',
        delete: 'authority/dictData/delete',
        listDictData: 'authority/dictData/listDictData'
    }
}
