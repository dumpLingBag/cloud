<template>
    <div class="role-auth">
        <el-row :gutter="50">
            <el-col :span="6" class="colSpan">
                <div class="roleFilter">
                    <el-input placeholder="输入角色关键字进行过滤" size="small" :clearable="true" v-model="roleFilterText"></el-input>
                </div>
                <el-tree :data="roleList" ref="roleTree" accordion :expand-on-click-node="true" :show-checkbox="selection" node-key="id"
                         :props="defaultProps" :filter-node-method="roleFilterNode" @check="roleNodeCheck" @node-click="roleNodeClick">
                </el-tree>
            </el-col>
            <el-col :span="6">
                <div class="authFilter">
                    <el-input placeholder="输入权限关键字进行过滤" size="small" :clearable="true" v-model="authFilterText"></el-input>
                </div>
                <el-tree :data="menuList" ref="authTree" accordion :expand-on-click-node="true" :show-checkbox="selection" node-key="id"
                         :check-strictly="false" :filter-node-method="authFilterNode" @node-click="menuNodeClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{data.label}}</span>
                        <span v-if="data.menuType === 0">（目录）</span>
                        <span v-if="data.menuType === 1">（菜单）</span>
                        <span v-if="data.menuType === 2">（权限）</span>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" icon="el-icon-folder-checked" size="small" @click="reset">重置选中</el-button>
                <el-button type="success" icon="el-icon-guide" size="small" @click="assignAuthority">分配权限</el-button>
                <div class="power">
                    <div v-for="item in listPower" :key="item.id" class="list-power">
                        <div class="power-title">{{item.name}}<el-button @click="handleCheckAllChange(item.id)" type="text">全选权限</el-button></div>
                        <el-checkbox-group v-model="power" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in item.children" :disabled="disabled" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "RoleAuth",
        data() {
            return {
                roleFilterText: '',
                authFilterText: '',
                menuList: [],
                selection: true,
                roleId: '',
                menuId: [],
                roleAuth: {
                    username: '',
                    nickname: ''
                },
                listMenu: [],
                listPower: [],
                power: [],
                checked: {},
                disabled: false
            }
        },
        props: {
            roleList: Array,
            defaultProps: Object
        },
        watch: {
            roleFilterText(val) {
                this.$refs.roleTree.filter(val);
            },
            authFilterText(val) {
                this.$refs.authTree.filter(val);
            }
        },
        mounted() {
            this.loadMenu()
        },
        methods: {
            loadMenu() {
                this.loading = true;
                this.$api.request(this.$url.AuthorityRoleMenu.load).then(res => {
                    if (res.code === 0) {
                        this.menuList = res.data;
                    }
                })
            },

            roleNodeCheck(data) {
                let role = this.$refs.roleTree.getCheckedNodes(true, false);
                if (data.pid !== '0') {
                    if (role.length > 0) {
                        this.$refs.roleTree.setCheckedKeys([]);
                        this.$refs.roleTree.setCheckedKeys([data.id]);
                    } else {
                        this.$refs.roleTree.setCheckedKeys([]);
                    }
                } else {
                    if (!data.children) {
                        if (role.length > 0) {
                            this.$refs.roleTree.setCheckedKeys([]);
                            this.$refs.roleTree.setCheckedKeys([data.id]);
                        } else {
                            this.$refs.roleTree.setCheckedKeys([]);
                        }
                    } else {
                        this.$refs.roleTree.setCheckedKeys([]);
                    }
                }
            },

            roleNodeClick(data) {
                if (data.pid !== '0' || !data.children) {
                    this.$refs.roleTree.setCheckedKeys([data.id]);
                    this.$api.request(this.$url.AuthorityRoleMenu.listMenu, this.$method.get, {roleId: data.id}).then(res => {
                        if (res.code === 0) {
                            if (res.data.roleMenu) {
                                this.$refs.authTree.setCheckedKeys(res.data.roleMenu);
                            } else {
                                this.$refs.authTree.setCheckedKeys([]);
                            }
                            this.listPower = res.data.menu && res.data.menu.length > 0 ? res.data.menu : [];
                            this.power = res.data.checked && res.data.checked.length > 0 ? res.data.checked : [];
                            this.disabled = res.data.menu && res.data.menu.length <= 0;
                        }
                    })
                }
            },

            menuNodeClick(data) {
                let that = this;
                if (data.pid !== '0' || !data.children) {
                    let role = this.$refs.roleTree.getCheckedNodes(true, false);
                    that.$api.request(that.$url.AuthorityRoleMenu.listAuth, that.$method.post, {ids: [data.id]}).then(res => {
                        if (res.code === 0) {
                            if (res.data && res.data.length > 0) {
                                let keys = this.$refs.authTree.getCheckedKeys(true).concat([data.id]);
                                this.$refs.authTree.setCheckedKeys(keys);
                                that.listPower = that.listPower.concat(res.data);
                            }
                        }
                    });
                    this.disabled = role && role.length <= 0;
                }
            },

            handleCheckAllChange(val) {
                this.listPower.forEach(key => {
                    if (key.id === val) {
                        key.children.forEach(m => {
                            this.power.push(m.id)
                        });
                        return false
                    }
                })
            },

            handleCheckedCitiesChange(value) {
                console.log(value)
            },

            loadCheckMenu(roleId) {
                this.$api.request(this.$url.AuthorityRoleMenu.listMenu, this.$method.get, {'roleId': roleId}).then(res => {
                    if (res.code === 0) {
                        let obj = [];
                        res.data.forEach(key => {
                            obj.push(key.menuId)
                        });
                        this.$refs.authTree.setCheckedKeys(obj);
                        this.menuId = obj;
                    }
                })
            },

            roleFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            authFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            assignAuthority() {
                let role = this.$refs.roleTree.getCheckedNodes(true, false);
                let auth = this.$refs.authTree.getCheckedNodes(false, true);
                if (role && auth && role.length > 0 && auth.length > 0) {
                    this.$confirm('确定要分配角色吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let menuIds = this.$cloud.getIds(auth).concat(this.power);
                        let obj = {roleId: role[0].id, menuId: menuIds};
                        this.$api.request(this.$url.AuthorityRoleMenu.save, this.$method.post, obj).then(res => {
                            if (res.code === 0) {
                                this.$notify({
                                    title: '提示',
                                    message: '更新权限成功',
                                    type: 'success'
                                });
                            }
                        })
                    }).catch(() => {
                        this.$message.info('取消操作')
                    })
                } else {
                    this.$message.warning('请先选择角色和权限')
                }
            },

            nodeRoleUser(data) {
                this.roleId = data.id;
                if (data.pid !== '0' || (data.pid === '0' && !data.children)) {
                    this.$refs.roleTree.setCheckedKeys([data.id]);
                    this.loadCheckMenu(data.id)
                }
            },

            reset() {
                this.$refs.authTree.setCheckedKeys([]);
                this.$refs.roleTree.setCheckedKeys([]);
                this.listPower = [];
                this.checked = []
            }
        }
    }
</script>

<style lang="scss">
    .role-auth {
        .roleFilter {

        }
        .power {
            margin-top: 20px;
            color: #606266;
        }
        .list-power {
            margin-bottom: 15px;
        }
        .power-title {
            margin-bottom: 10px;
            .el-button--text {
                margin-left: 10px;
            }
        }
    }
</style>