<template>
    <div class="sys-user">
        <v-search-user v-on:addUser="addUser" :page="page" v-on:userStyle="userStyle"
                       v-on:enableSelect="enableSelect" v-on:onSubmit="onSubmit" v-on:delBatchUser="delBatchUser"
                       v-on:resetSearch="resetSearch" :multipleSelection="multipleSelection"></v-search-user>
        <v-add-user :dialogUser="dialogUser" :addOrEdit="addOrEdit" v-on:cancel="cancel"
                    :userForm="userForm"></v-add-user>
        <div class="user-main vue-padding radius">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="userList" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="selectable" fixed width="55"></el-table-column>
                <el-table-column prop="username" label="账号名称"></el-table-column>
                <el-table-column prop="nickname" label="用户昵称"></el-table-column>
                <el-table-column prop="sex" label="性别">
                    <template slot-scope="scope">
                        {{Number(scope.row.sex) === 1 ? '女' : '男'}}
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
                <el-table-column prop="mobile" label="号码" width="150"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag size="medium" @click="tagEnable(scope.$index, scope.row)"
                                :type="Number(scope.row.enabled) === 1 ? 'success' : 'warning'">
                            {{ Number(scope.row.enabled) === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="注册时间" width="200">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span class="times">{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="editUser(scope.row)">编辑</el-button>
                        <el-button type="warning" size="mini" @click="resetPassword(scope.row)"
                                   :disabled="scope.row.parentId === '0'">重置
                        </el-button>
                        <el-button type="danger" v-hasPerm="['sys:user:add']" size="mini" @click="delUser(scope.row)"
                                   :disabled="scope.row.parentId === '0'">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :current-page="page.currentPage"
                           :total="page.totalSize" :page-size="page.pageSize"
                           @current-change="currentChange"></el-pagination>
        </div>
    </div>
</template>

<script>
    import {httpData} from '@/common/httpData'
    import vAddUser from '@/components/authority/user/AddUser'
    import vSearchUser from '@/components/authority/user/SearchUser'

    export default {
        name: 'AuthorityUser',
        components: {vAddUser, vSearchUser},
        data() {
            return {
                userList: [], // 表格数据
                tableHeight: '', // 动态设置最大高度
                addOrEdit: false, // 添加或者编辑用户
                dialogRole: false,
                roleList: [], // 机构拥有的角色
                selectRole: [], // 用户选中后拥有的角色ID
                selectAddRoleValue: [], // 用来筛选新增的角色
                selectDiffRoleValue: [], // 用来筛选修改的角色
                userId: '',
                dialogUser: false, // 新增表单弹框
                loading: false,
                multipleSelection: [], // 表格多选框数据
                formLabelWidth: '120px',
                // 添加用户表单数据
                userForm: {
                    nickname: '',
                    username: '',
                    password: '',
                    checkPassword: '',
                    email: '',
                    mobile: '',
                    enabled: '',
                    parentId: '',
                    sex: ''
                },
                page: {// 初始分页数据
                    pageSize: 10,
                    currentPage: 1,
                    search: {
                        username: '',
                        enabled: '',
                        nickname: ''
                    }
                }
            }
        },
        mounted() {
            this.currentChange(); // 分页获取用户信息
        },
        methods: {
            // 表格复选框
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            // 模糊搜索
            onSubmit() {
                //this.page = page;
                this.currentChange()
            },
            // 重置搜索表单数据
            resetSearch(page) {
                this.page = page;
                this.currentChange() // 重新加载分页数据
            },
            // 模糊搜索下拉框监听事件
            enableSelect(enable) {
                this.page.search.enable = enable;
                this.currentChange()
            },
            // 添加用户
            addUser() {
                this.dialogUser = true;
                this.addOrEdit = true
            },
            // 更换用户列表样式
            userStyle() {
                alert('11111')
            },
            // 关闭添加用户弹窗
            cancel(dialogUser, status) {
                this.dialogUser = dialogUser;
                if (status) {
                    this.currentChange(this.page.currentPage)
                }
            },
            // 编辑用户信息
            editUser(row) {
                this.dialogUser = true;
                this.addOrEdit = false;
                Object.keys(this.userForm).forEach(key => {
                    if (key === 'enabled' || key === 'sex') {
                        this.userForm[key] = String(row[key])
                    } else {
                        this.userForm[key] = row[key]
                    }
                });
                this.userForm.id = row.id
            },
            // 删除用户信息
            delUser(row) {
                this.$confirm('确定要删除该用户吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.request(this.$url.AuthorityUser.delete + '/' + row.id,
                        this.$method.delete).then(res => {
                        if (res.code === 0) {
                            this.$message.success('删除用户成功');
                            this.currentChange(this.page.currentPage)
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消删除!')
                })
            },
            // 批量删除用户
            delBatchUser() {
                this.$confirm('确定要删除选中的用户吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.request(this.$url.AuthorityUser.delete, this.$method.delete,
                        {userIds: this.getUserIds(this.multipleSelection)}).then(res => {
                        if (res.code === 0) {
                            this.$message.success('删除用户成功');
                            this.currentChange(this.page.currentPage)
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消删除!')
                })
            },
            // 重置用户密码
            resetPassword(row) {
                this.$confirm('确定重置该用户的密码吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.request(this.$url.AuthorityUser.resetPassword + '/' + row.id,
                        this.$method.put).then(res => {
                        if (res.code === 0) {
                            this.$alert('你的密码被重置为<span style="color: red;font-weight: bold;">' + res.data + '</span>请妥善保管。',
                                '重置密码', {dangerouslyUseHTMLString: true})
                        }
                    })
                }).catch(() => {
                    this.$message.info('已取消重置密码')
                })
            },
            selectable(row, index) {
                return row.parentId !== '0';
            },
            // 分页获取用户信息
            currentChange(currentPage) {
                this.loading = !this.loading;
                this.page.currentPage = currentPage ? currentPage : 1;
                this.$api.request(this.$url.AuthorityUser.pageList, this.$method.post,
                    httpData(this.page)).then(res => {
                    if (res.code === 0) {
                        if (res.data && res.data.records) {
                            this.userList = res.data.records;
                            this.page.totalSize = parseInt(res.data.total)
                        } else {
                            this.userList = []
                        }
                    }
                    this.loading = !this.loading;
                }, () => {
                    this.loading = !this.loading
                })
            },
            tagEnable(index, row) {
                if (row.parentId === '0') {
                    this.$message.warning('禁止修改超级管理员状态')
                } else {
                    const enabled = row.enabled === 1 ? 0 : 1;
                    this.$api.request(this.$url.AuthorityUser.enabled + '/' + row.id + '/' + enabled,
                        this.$method.put).then(res => {
                        if (res.code === 0) {
                            this.currentChange(this.page.currentPage)
                        } else {
                            this.$message(res.msg)
                        }
                    })
                }
            },
            diffRole(role, checked, isArr) {
                if (role && role.length > 0) {
                    let arr = [];
                    for (let i = 0; i < role.length; i++) {
                        if (isArr) {
                            arr.push({checked: checked, roleId: role[i]})
                        } else {
                            arr.push({checked: checked, roleId: role[i].roleId})
                        }
                    }
                    return arr
                }
            },
            getUserIds(obj) {
                let ids = [];
                Object.keys(obj).forEach(key => {
                    ids.push(key.id)
                });
                return ids;
            }
        }
    }
</script>

<style lang="scss">
    .sys-user {
        .user-main {
            overflow: hidden;
        }

        .el-dialog__body {
            padding: 30px 80px;
        }

        .el-select {
            width: 100%;
        }

        .times {
            margin-left: 10px;
        }
    }
</style>
