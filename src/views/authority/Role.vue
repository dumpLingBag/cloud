<template>
    <div class="sys-tree">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-left">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="appendRole">增加</el-button>
            </div>
        </div>
        <div class="vue-padding radius">
            <el-table :data="roleList" v-loading="loading" row-key="id"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="name" label="角色名称" sortable></el-table-column>
                <el-table-column prop="authName" label="权限字符" sortable></el-table-column>
                <el-table-column prop="sort" label="角色排序" sortable></el-table-column>
                <el-table-column prop="enabled" label="状态" sortable>
                    <template slot-scope="scope">
                        <el-tag size="medium" @click="tagEnabled(scope.$index, scope.row)"
                                :type="String(scope.row.enabled) === '1' ? 'success' : 'warning'">
                            {{String(scope.row.enabled) === '1' ? '启用' : '禁用'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
                <el-table-column label="操作" fixed="right" width="260">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="modify(scope.row)">编辑</el-button>
                        <el-button size="mini" type="primary" @click="append(scope.row)">增加</el-button>
                        <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="roleStatus ? '添加角色' : '修改角色'" :visible.sync="dialogRole" width="50%"
                   :modal-append-to-body='true'
                   :append-to-body="true">
            <el-form ref="roleData" :model="roleData" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级角色">
                            <tree-select v-model="selectId" :show-count="true" placeholder="请选择上级角色"
                                        :options="roleListDialog"></tree-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model="roleData.name" placeholder="请输入角色名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="权限字符" prop="authName">
                            <el-input v-model="roleData.authName" placeholder="请输入权限字符 如:ROLE_ADMIN"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色状态" prop="enabled">
                            <el-radio-group v-model="roleData.enabled" size="medium">
                                <el-radio border label="1">启用</el-radio>
                                <el-radio border label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色排序" prop="sort">
                            <el-input-number v-model="roleData.sort" controls-position="right" @change="sortChange"
                                             :min="1" :max="10"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button @click="dialogRole = false">取 消</el-button>
          <el-button type="primary" @click="addRole('roleData')">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import TreeSelect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    export default {
        name: 'Role',
        components: {TreeSelect},
        data() {
            return {
                loading: false,
                dialogRole: false,
                roleStatus: false,
                selectId: '',
                roleData: {
                    id: '',
                    name: '',
                    enabled: '',
                    sort: '',
                    createTime: '',
                    pid: '',
                    authName: ''
                },
                roleList: [],
                roleListDialog: [{id: '1', label: '主目录', children: []}],
                rules: {
                    name: [
                        {
                            required: true,
                            message: '只能是中文，英文，数字和下划线',
                            target: 'blur',
                            pattern: '^[\u4e00-\u9fa5a-zA-Z_0-9]+$'
                        }
                    ],
                    authName: [
                        {
                            required: true,
                            message: '只能为大写英文和下划线并以大写字母结尾',
                            target: 'blur',
                            pattern: '(^[A-Z][A-Z_]*[A-Z])|(^[A-Z]{1})$'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.loadRole()
        },
        methods: {
            loadRole() {
                // 加载角色信息
                this.loading = true;
                this.$api.request(this.$url.AuthorityRole.load, this.$method.get).then(res => {
                    if (res.code === 0) {
                        this.roleList = res.data;
                        this.roleListDialog[0].children = res.data
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },
            appendRole() {
                this.selectId = '1';
                this.roleData.enabled = '1';
                this.roleData.sort = this.roleList.length + 1;
                this.dialogRole = true;
                this.roleStatus = true
            },
            modify(data) {
                this.roleStatus = false;
                Object.keys(this.roleData).forEach(key => {
                    if (key === 'enabled') {
                        this.roleData[key] = String(data.enabled)
                    } else {
                        if (key === 'pid') {
                            this.selectId = data.pid
                        } else {
                            this.roleData[key] = data[key]
                        }
                    }
                });
                this.dialogRole = true
            },
            append(data) {
                if (data.pid === '0' || data.pid === '1') {
                    this.roleStatus = true;
                    Object.keys(this.roleData).forEach(key => {
                        if (key === 'enabled') {
                            this.roleData[key] = '1'
                        } else {
                            if (key === 'pid') {
                                this.selectId = data.id
                            } else {
                                this.roleData[key] = ''
                            }
                        }
                    });
                    let children = data.children;
                    this.roleData.sort = children && children.length > 0 ? children.length + 1 : 0;
                    this.dialogRole = true
                } else {
                    this.$message.warning('角色最多添加两级')
                }

            },
            remove(data) {
                let text = data.pid === '0' ? '你确定删除该角色及其子角色吗？角色删除会导致分配的权限失效' : '你确定删除该角色吗？角色删除会导致分配的权限失效';
                this.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()  => {
                    let array = [data.id];
                    if (data.pid === '0') {
                        this.delRole(array, data)
                    }
                    this.$api.request(this.$url.AuthorityRole.delete, this.$method.delete, {roleIdList: array}).then(res => {
                        if (res.code === 0) {
                            this.$message.success('角色删除成功');
                            this.loadRole()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消删除角色');
                })
            },
            addRole(role) {
                this.$refs[role].validate((valid) => {
                    if (valid) {
                        this.roleData.pid = this.selectId;
                        let url = this.$url.AuthorityRole.save;
                        let method = this.$method.post;
                        if (this.roleData.id) {
                            url = this.$url.AuthorityRole.update;
                            method = this.$method.put
                        }
                        this.$api.request(url, method, this.roleData).then(res => {
                            if (res.code === 0) {
                                this.$message.success('添加角色成功');
                                this.dialogRole = false;
                                this.loadRole()
                            }
                        }).catch(() => {
                            this.$message.error('添加菜单失败')
                        })
                    } else {
                        return false
                    }
                })
            },
            tagEnabled(index, row) {
                let enabled = String(row.enabled) === '1' ? '0' : '1';
                let text = enabled === '1' ? '启用' : '禁用';
                this.$confirm(String(row.pid) === '0' ? '确定' + text + '所有子角色吗？' : '确定' + text + '该角色吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let array = [row.id];
                    if (String(row.pid) === '0') {
                        this.delRole(array, row)
                    }
                    let obj = {enabled: enabled, roleIdList: array};
                    this.$api.request(this.$url.AuthorityRole.updateInList, this.$method.put, obj).then(res => {
                        if (res.code === 0) {
                            this.$message.success('菜单状态更新成功');
                            this.loadRole()
                        }
                    }).catch(() => {
                        this.$message.success('菜单状态更新失败')
                    })
                }).catch(() => {
                    this.$message.info('取消更新')
                })
            },
            delRole(array, data) {
                if (data && data.children) {
                    for (let i = 0; i < data.children.length; i++) {
                        array.push(data.children[i].id);
                        let children = data.children[i];
                        if (children.children && children.children.length > 0) {
                            this.delRole(children.children)
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    @import '~@/assets/scss/tree';

    .vue-treeselect__placeholder {
        line-height: 40px;
        padding: 0 10px;
    }

    .vue-treeselect__single-value {
        padding: 0 10px;
        line-height: 40px;
    }
</style>
