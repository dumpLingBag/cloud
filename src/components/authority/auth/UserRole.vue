<template>
    <div class="user-role">
        <el-row>
            <el-col :span="5" class="colSpan">
                <div style="padding-right: 30px;">
                    <div class="roleFilter">
                        <el-input placeholder="输入角色关键字进行过滤" size="small" :clearable="true" v-model="userFilterText"></el-input>
                    </div>
                    <el-tree :data="roleList" ref="userTree" accordion :expand-on-click-node="true"
                        :props="defaultProps" :filter-node-method="userFilterNode" @node-click="nodeRoleUser">
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="19">
                <el-row>
                    <el-col :span="4">
                        <el-button type="danger" size="small" :disabled="userIds.length <= 0" @click="assignRole">清空角色</el-button>
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
                    <el-table-column type="selection" fixed width="55"></el-table-column>
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
                            <template v-else><span class="not-role">未分配角色</span></template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
                    <el-table-column prop="mobile" label="号码" width="150"></el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="warning" @click="editRole(scope.row)">角色</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="prev, pager, next" :current-page="userRole.currentPage"
                               :total="totalSize" :page-size="userRole.pageSize"
                               @current-change="currentChange"></el-pagination>
            </el-col>
        </el-row>
        <el-dialog
                title="分配角色"
                :visible.sync="dialogVisible"
                width="25%" @open="openListRole"
                :modal-append-to-body='true'
                :append-to-body="true"
                :before-close="handleClose">
            <el-select v-model="values" filterable multiple clearable placeholder="请选择角色信息" style="width: 100%">
                <el-option
                        v-for="item in listRole"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveUserRole">确 定</el-button>
  </span>
        </el-dialog>
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
                selection: true,
                userRole: {
                    roleId: '',
                    username: '',
                    nickname: '',
                    currentPage: 1,
                    pageSize: 10
                },
                isRoleCheck: false,
                totalSize: '',
                userIds: [],
                roleId: [],
                dialogVisible: false,
                listRole: [],
                values: [],
                userId: ''
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
            this.getUserList();
            this.getRoleList()
        },
        methods: {
            // 角色筛选
            userFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            editRole(data) {
                this.dialogVisible = true;
                this.userId = data.id
            },

            handleClose() {
                this.dialogVisible = false
            },

            openListRole() {
                this.values = [];
                this.$api.request(this.$url.AuthorityUserRole.listRoleByUserId, this.$method.get, {userId: this.userId}).then(res => {
                    if (res.code === 0) {
                        if (res.data && res.data.length > 0) {
                            res.data.forEach(key => {
                                this.values.push(key.roleId)
                            })
                        }
                    }
                })
            },

            // 加载用户
            getUserList() {
                this.loading = true;
                this.userIds = [];
                this.$api.request(this.$url.AuthorityUserRole.loadUserByRoleId, this.$method.get, this.userRole).then(res => {
                    if (res.code === 0) {
                        this.userList = res.data.records;
                        this.totalSize = Number(res.data.total)
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },

            // 加载角色
            getRoleList() {
                this.$api.request(this.$url.AuthorityRole.listByPid, this.$method.get).then(res => {
                    if (res.code === 0) {
                        this.listRole = res.data
                    }
                })
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
                this.userRole.nickname = '';
                this.userRole.username = '';
                this.getUserList()
            },

            // 更新用户角色信息
            saveUserRole() {
                if (this.userId && this.values.length > 0) {
                    let obj = {userId: this.userId, roleIds: this.values};
                    this.$api.request(this.$url.AuthorityUserRole.save, this.$method.post, obj).then(res => {
                        if (res.code === 0) {
                            this.$message.success('更新成功');
                            this.dialogVisible = false;
                            this.getUserList()
                        }
                    })
                }
            },

            select(selection) {
                this.setUserId(selection)
            },

            selectAll(selection) {
                this.setUserId(selection)
            },

            // 设置选中用户 id
            setUserId(e) {
                this.userIds = [];
                e.forEach(key => {
                    this.userIds.push(key.id)
                })
            },

            // 切换角色分配
            assignRole() {
                if (this.userIds.length > 0) {
                    this.$api.request(this.$url.AuthorityUserRole.clearRole, this.$method.delete, {userIds: this.userIds, roleId: this.userRole.roleId}).then(res => {
                        if (res.code === 0) {
                            this.$message.success('清空角色信息成功');
                            this.getUserList()
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .user-role .not-role {
        color: #E6A23C;
    }
</style>