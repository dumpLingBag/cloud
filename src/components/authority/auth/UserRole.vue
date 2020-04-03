<template>
    <div class="user-role">
        <el-row>
            <el-col :span="5" class="colSpan">
                <div style="padding-right: 30px;">
                    <div class="roleFilter">
                        <el-input placeholder="输入角色关键字进行过滤" size="small" :clearable="true" v-model="userFilterText"></el-input>
                    </div>
                    <el-tree :data="roleList" ref="userTree" accordion :expand-on-click-node="true" :show-checkbox="selection" node-key="id"
                             :props="defaultProps" :filter-node-method="userFilterNode" @node-click="nodeRoleUser" @check="roleCheck">
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="19">
                <el-row>
                    <el-col :span="4">
                        <el-button :type="selection ? 'warning': 'primary'" size="small" @click="isSelection">{{selection ? '取消分配' : '分配角色'}}</el-button>
                    </el-col>
                    <el-col :span="20">
                        <el-form :inline="true" :model="userRole" class="demo-form-inline" size="small" style="float: right;">
                            <el-form-item>
                                <el-input v-model="userRole.username" placeholder="用户名"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="userRole.nickname" placeholder="用户昵称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="userRoleQuery">查询</el-button>
                                <el-button icon="el-icon-refresh" @click="userRoleReset">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-table v-loading="loading" element-loading-text="拼命加载中" :data="userList" style="width: 100%"
                          ref="userTable" @select="select" @select-all="selectAll">
                    <el-table-column type="selection" fixed width="55" v-if="selection"></el-table-column>
                    <el-table-column prop="username" label="账号名称"></el-table-column>
                    <el-table-column prop="nickname" label="用户昵称"></el-table-column>
                    <el-table-column prop="sex" label="性别">
                        <template slot-scope="scope">
                            {{Number(scope.row.sex) === 1 ? '女' : '男'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="roles" label="角色" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <template v-if="scope.row.roles && scope.row.roles.length > 0">
                                <span v-for="(item, index) in scope.row.roles" :key="index">
                                    {{item.name}}
                                </span>
                            </template>
                            <template v-else>未分配角色</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
                    <el-table-column prop="mobile" label="号码" width="150"></el-table-column>
                </el-table>
                <el-pagination background layout="prev, pager, next" :current-page="userRole.currentPage"
                               :total="totalSize" :page-size="userRole.pageSize"
                               @current-change="currentChange"></el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "UserRole",
        data() {
            return {
                userFilterText: '',
                active: '',
                loading: false,
                userList: [],
                selection: false,
                userRole: {
                    roleId: '',
                    username: '',
                    nickname: '',
                    currentPage: 1,
                    pageSize: 10
                },
                isRoleCheck: false,
                totalSize: '',
                userId: [],
                roleId: []
            }
        },
        props: {
            roleList: Array,
            defaultProps: Object
        },
        watch: {
            userFilterText(val) {
                this.$refs.userTree.filter(val);
            }
        },
        mounted() {
            this.getUserList()
        },
        methods: {
            // 角色筛选
            userFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            // 角色复选框被选中时更新角色信息
            roleCheck(data) {
                let role = this.$refs.userTree.getCheckedNodes(true, false);
                if (this.userRole.roleId) {
                    if (data.id === this.userRole.roleId) {
                        this.$confirm('是否为选中用户取消该角色', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            //this.updateUserRole(this.getRoleIds(data), this.userId)
                            this.saveUserRole(this.userId, this.getRoleIds(data), 0)
                        }).catch(() => {
                            this.$refs.userTree.setCheckedKeys([this.userRole.roleId]);
                        })
                    } else {
                        let roles =  role.filter((key) => {
                            return key.id !== this.userRole.roleId
                        });
                        this.setRole(roles)
                    }
                } else {
                    this.isRoleCheck = true;
                    if (this.userId.length > 0) {
                        if (role.length > 0) {
                            this.setRole(role)
                        }
                    }
                }
            },

            // 分配角色
            setRole(role) {
                this.$confirm('是否为当前选中用户分配选中角色', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //this.saveUserRole(role)
                    this.saveUserRole(this.userId, this.getRoleIds(role), 1)
                }).catch(() => {
                    this.resetCheck()
                })
            },

            // 角色被点击时加载指定用户
            nodeRoleUser(data) {
                this.isRoleCheck = false;
                if (!data.children) {
                    this.userRole.roleId = data.id;
                    this.getUserList()
                }
            },

            // 加载用户
            getUserList() {
                this.loading = true;
                this.$api.request(this.$url.AuthorityUserRole.loadUserByRoleId, this.$method.get, this.userRole).then(res => {
                    if (res.code === 0) {
                        this.userList = res.data.records;
                        this.totalSize = Number(res.data.total)
                    }
                    this.loading = false;
                })
            },

            reset() {
                let current = window.document.getElementsByClassName('is-current');
                current[0].classList.remove('is-current')
            },

            // 重置角色和用户复选框选中
            resetCheck() {
                this.$refs.userTree.setCheckedKeys([]);
                this.$refs.userTable.clearSelection();
                this.selection = false;
                this.userId = []
            },

            select(selection) {
                if (this.userId.length > 0) {
                    if (this.userRole.roleId) {
                        this.$confirm('是否取消该用户拥有的角色', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let role = this.$refs.userTree.getCheckedNodes(true, false);
                            let userIds = this.userId.filter((key) => {
                                return selection[0].id !== key;
                            });
                            //this.updateUserRole(this.getRoleIds(role), userIds)
                            this.saveUserRole(userIds, this.getRoleIds(role), 0)
                        }).catch(() => {
                            this.resetCheck()
                        })
                    }
                } else {
                    this.setUserId(selection);
                    this.userSelect()
                }
            },

            selectAll(selection) {
                if (this.userId.length > 0) {
                    if (this.userRole.roleId) {
                        this.$confirm('是否取消该用户拥有的角色', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let role = this.$refs.userTree.getCheckedNodes(true, false);
                            //this.updateUserRole(this.getRoleIds(role), this.userId)
                            this.saveUserRole(this.userId, this.getRoleIds(role), 0);
                        }).catch(() => {
                            this.resetCheck()
                        })
                    }
                } else {
                    this.setUserId(selection);
                    this.userSelect()
                }
            },

            userSelect() {
                if (this.isRoleCheck) {
                    let role = this.$refs.userTree.getCheckedNodes(true, false);
                    if (role && role.length > 0) {
                        this.$confirm('是否为当前选中用户分配选中角色', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.saveUserRole(this.userId, this.getRoleIds(role), 1)
                        }).catch(() => {
                            this.resetCheck()
                        })
                    }
                }
            },

            // 点击下一页或上一页
            currentChange(currentPage) {
                this.userRole.currentPage = currentPage ? currentPage : 1;
                this.getUserList()
            },

            // 根据条件查询用户
            userRoleQuery() {
                this.getUserList()
            },

            // 清空筛选条件
            userRoleReset() {
                this.userRole.roleId = '';
                this.userRole.nickname = '';
                this.userRole.username = '';
                this.resetCheck();
                this.getUserList()
            },

            // 设置选中用户 id
            setUserId(e) {
                this.userId = [];
                e.forEach(key => {
                    this.userId.push(key.id)
                })
            },

            // 更新用户角色信息
            saveUserRole(userId, roleIds, type) {
                if (roleIds.length > 0 && this.userId.length > 0 && type) {
                    let obj = {userIds: userId, roleIds: roleIds, type: type};
                    this.$api.request(this.$url.AuthorityUserRole.save, this.$method.post, obj).then(res => {
                        if (res.code === 0) {
                            this.$message.success('更新成功')
                        }
                    })
                }
            },

            updateUserRole(roleIds, userIds) {
                if (roleIds.length > 0 && this.userId.length > 0) {
                    let obj = {userIds: userIds, roleIds: roleIds};
                    this.$api.request(this.$url.AuthorityUserRole.update, this.$method.put, obj).then(res  => {
                        if (res.code === 0) {
                            this.$message.info('成功取消该用户角色')
                        }
                    })
                }
            },

            // 切换角色分配
            isSelection() {
                this.selection = !this.selection;
                if (this.selection) {
                    if (this.userRole.roleId && this.userList.length > 0) {
                        if (this.userId.length <= 0) {
                            this.$refs.userTable.toggleAllSelection();
                        }
                        this.$refs.userTree.setCheckedKeys([this.userRole.roleId]);
                    }
                }
            },

            getRoleIds(roleIds) {
                let obj = [];
                roleIds.forEach(key => {
                    obj.push(key.id)
                });
                return obj;
            }
        }
    }
</script>

<style scoped>

</style>