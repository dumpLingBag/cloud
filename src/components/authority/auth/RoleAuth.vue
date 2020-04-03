<template>
    <div class="role-auth">
        <el-row :gutter="50">
            <el-col :span="6" class="colSpan">
                <div class="roleFilter">
                    <el-input placeholder="输入角色关键字进行过滤" size="small" :clearable="true" v-model="roleFilterText"></el-input>
                </div>
                <el-tree :data="roleList" ref="roleTree" accordion :expand-on-click-node="true" :show-checkbox="selection" node-key="id"
                         :props="defaultProps" :filter-node-method="roleFilterNode" @node-click="nodeRoleUser" @check="roleCheck">
                </el-tree>
            </el-col>
            <el-col :span="6">
                <div class="authFilter">
                    <el-input placeholder="输入权限关键字进行过滤" size="small" :clearable="true" v-model="authFilterText"></el-input>
                </div>
                <el-tree :data="menuList" ref="authTree" accordion :expand-on-click-node="true" :show-checkbox="selection" node-key="id"
                         :check-strictly="false" :filter-node-method="authFilterNode" @node-click="authRoleUser" @check="authCheck">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{data.label}}</span>
                        <span v-if="data.menuType === 0">（目录）</span>
                        <span v-if="data.menuType === 1">（菜单）</span>
                        <span v-if="data.menuType === 2">（权限）</span>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="12">
                <el-button type="primary" icon="el-icon-magic-stick" size="small" @click="reset">重置选中</el-button>
                <el-button type="primary" icon="el-icon-key" size="small" @click="reset">分配权限</el-button>
                <div class="power">
                    <!--<el-checkbox :indeterminate="isIndeterminate" v-model="check.a" @change="handleCheckAllChange(this,'1')">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange(this,'2')">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities2" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>-->
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
                listPower: []
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

            /*handleCheckAllChange(val) {
                this.checkedCities = val ? cityOptions : [];
                this.isIndeterminate = false;
            },*/
            /*handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },*/

            loadCheckMenu(roleId) {
                this.$api.request(this.$url.AuthorityRoleMenu.loadMenu, this.$method.get, {'roleId': roleId}).then(res => {
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

            nodeRoleUser(data) {
                this.roleId = data.id;
                if (data.pid !== '0' || (data.pid === '0' && !data.children)) {
                    this.$refs.roleTree.setCheckedKeys([data.id]);
                    this.loadCheckMenu(data.id)
                }
            },

            authRoleUser(data) {
                this.$api.request(this.$url.AuthorityRoleMenu.listAuth, this.$method.post, {ids: [data.id, data.id]}).then(res => {
                    if (res.code === 0) {
                        console.log(res.data)
                    }
                })
            },

            roleCheck(data) {
                let role = this.$refs.roleTree.getCheckedNodes(true, false);
                let auth = this.$refs.authTree.getCheckedNodes(false, true);
                if (data.pid === '0') {
                    this.$refs.roleTree.setCheckedKeys([]);
                    return;
                } else {
                    if (role.length > 0) {
                        this.$refs.roleTree.setCheckedKeys([]);
                        this.$refs.roleTree.setCheckedKeys([data.id]);
                    } else {
                        if (auth.length > 0) {
                            this.authConfirm('是否取消该角色权限', data.id, this.getAuthIds(auth), 0)
                        }
                        this.$refs.authTree.setCheckedKeys([]);
                    }
                }
                if (auth.length > 0 && role.length > 0) {
                    this.authConfirm('是否为选中角色分配权限', data.id, this.getAuthIds(auth), 1)
                }
                if (role.length <= 0 && data.id === this.roleId) {
                    this.$refs.authTree.setCheckedKeys([]);
                }
                this.roleId = data.id
            },

            authCheck(data) {
                let role = this.$refs.roleTree.getCheckedNodes(true, false);
                let auth = this.$refs.authTree.getCheckedNodes(false, true);
                console.log(this.getAuthIds(auth));
                if (data.pid === '0') {
                    if (role.length > 0) {
                        if (auth.length > 0) {
                            if (this.menuId.length > 0) {
                                let menuId;
                                this.menuId.forEach(key => {
                                    menuId = auth.filter(k => {
                                        return k.id !== key
                                    })
                                });
                                this.authConfirm('是否为选中角色分配权限', role[0].id, this.getAuthIds(menuId), 1)
                            } else {
                                this.authConfirm('是否为选中角色分配权限', role[0].id, this.getAuthIds(auth), 1)
                            }
                        } else {
                            this.authConfirm('是否取消该角色权限', role[0].id, this.getAuthIds(data.children), 0)
                        }
                    }
                } else {
                    if (role.length > 0) {
                        if (auth.length > 0) {
                            let idx = auth.find(key => {
                                return key.id === data.id;
                            });
                            if (idx) {
                                this.authConfirm('是否为选中角色分配权限', role[0].id, [data.id], 1)
                            } else {
                                this.authConfirm('是否取消该角色权限', role[0].id, [data.id], 0)
                            }
                        } else {
                            this.authConfirm('是否取消该角色权限', role[0].id, [data.id], 0)
                        }
                    }
                }
            },

            authConfirm(text, roleId, menuId, type) {
                this.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.saveRoleAuth(roleId, menuId, type)
                }).catch(() => {
                    this.menuId = [];
                    this.$message.info('取消角色设置')
                })
            },

            saveRoleAuth(roleId, menuIds, type) {
                let obj = {roleId: roleId, menuId: menuIds, type: type};
                console.log(obj)
                /*this.$api.request(this.$url.AuthorityRoleMenu.save, this.$method.post, obj).then(res => {
                    if (res.code === 0) {
                        this.$message.success('权限更新成功')
                    }
                })*/
            },

            reset() {
                this.$refs.authTree.setCheckedKeys([]);
                this.$refs.roleTree.setCheckedKeys([]);
            },

            getAuthIds(authIds) {
                let obj = [];
                authIds.forEach(key => {
                    obj.push(key.id)
                });
                return obj;
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
    }
</style>