<template>
    <div class="sys-tree">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-left">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="appendNode">增加</el-button>
            </div>
        </div>
        <div class="vue-padding radius">
            <el-table :data="menuList" v-loading="loading" row-key="id"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="name" label="菜单名称" sortable width="150"></el-table-column>
                <el-table-column prop="icon" label="图标" sortable width="100">
                    <template slot-scope="scope">
                        <span :class="scope.row.icon"></span>
                    </template>
                </el-table-column>
                <el-table-column label="类型" sortable width="120">
                    <template slot-scope="scope">
                        <el-tag size="medium" v-if="scope.row.menuType === 0">目录</el-tag>
                        <el-tag size="medium" v-if="scope.row.menuType === 1" type="success">菜单</el-tag>
                        <el-tag size="medium" v-if="scope.row.menuType === 2" type="warning">按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="组件路径" :show-overflow-tooltip="true" sortable width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.path && scope.row.component">{{scope.row.path + '/' + url(scope.row.component)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="路由名称" prop="component" :show-overflow-tooltip="true" sortable width="180"></el-table-column>
                <el-table-column label="请求路径" prop="menuUrl" :show-overflow-tooltip="true" sortable width="180"></el-table-column>
                <el-table-column prop="enabled" label="状态" sortable width="100">
                    <template slot-scope="scope">
                        <el-tag size="medium" @click="tagEnabled(scope.$index, scope.row)"
                                :type="String(scope.row.enabled) === '1' ? 'success' : 'warning'">
                            {{String(scope.row.enabled) === '1' ? '启用' : '禁用'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" sortable width="100"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable width="160"></el-table-column>
                <el-table-column label="操作" fixed="right" width="260">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="modify(scope.row)">编辑</el-button>
                        <el-button size="mini" type="primary" :disabled="scope.row.menuType && scope.row.menuType === 2" @click="append(scope.row)">增加</el-button>
                        <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 添加路由弹框 -->
            <v-add-menu :dialogAddMenu="dialogAddMenu" :isMenuProp="isMenuProp" :nodeData="nodeData"
                        :selectId="selectId" :menuList="addMenuList"
                        v-on:closeDialogAddMenu="closeDialogAddMenu" v-on:updateMenu="updateMenu"
                        :addOrEdit="addOrEdit"></v-add-menu>
        </div>
    </div>
</template>

<script>
    import vAddMenu from '@/components/authority/menu/AddMenu'
    import lineUtil from '@/utils/humpToLine'

    export default {
        name: 'Menu',
        components: {vAddMenu},
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val)
            }
        },
        data() {
            return {
                menuList: [], // 菜单树结构
                addMenuList: [{id: '0', label: '主目录', children: []}],
                loading: false,
                dialogAddMenu: false, // 是否显示添加菜单弹框
                isMenuProp: false, // 不同层级菜单校验字段不一致
                nodeData: {
                    component: '',
                    enabled: '',
                    icon: '',
                    id: '',
                    label: '',
                    menuType: '',
                    name: '',
                    path: '',
                    pid: '',
                    sort: '',
                    authority: '',
                    menuUrl: ''
                },
                selectId: '',
                node: '',
                addOrEdit: false,
                currentKey: Number,
                checkUrlList: []
            }
        },
        mounted() {
            this.loadMenu()
        },
        computed: {
            treeHeight() {
                let store = this.$store.state;
                return store.tagsTop ? store.innerHeight - this.$common.menuTreeHeight - 50 : store.innerHeight - this.$common.menuTreeHeight;
            }
        },
        methods: {
            loadMenu() {
                this.loading = true
                this.$api.request(this.$url.AuthorityMenu.list).then(res => {
                    if (res.code === 0) {
                        this.menuList = res.data
                        this.addMenuList[0].children = res.data
                        this.loading = false
                    }
                }).catch(() => {
                    this.loading = false
                })
            },

            url(str) {
                return lineUtil.toLine(str)
            },

            append(data) { // 添加菜单
                if (data.menuType && data.menuType === 2) {
                    this.$message.warning('按钮不支持添加下级菜单')
                } else {
                    this.addOrEdit = true
                    Object.keys(this.nodeData).forEach(key => {
                        if (key === 'enabled' || key === 'menuType') {
                            this.nodeData[key] = '1'
                        } else {
                            if (key === 'pid') {
                                this.selectId = data.id
                            } else {
                                this.nodeData[key] = ''
                            }
                        }
                    })
                    let children = data.children
                    this.nodeData.sort = children && children.length > 0 ? children.length + 1 : 1;
                    this.dialog()
                }
            },

            keysNode(data) {
                Object.keys(this.nodeData).forEach(key => {
                    if (key !== 'children' && key !== 'meta') {
                        if (key === 'enabled' || key === 'menuType') {
                            this.nodeData[key] = String(data[key])
                        } else {
                            this.nodeData[key] = data[key]
                        }
                    }
                })
            },

            tagEnabled(index, row) {
                let enabled = String(row.enabled) === '1' ? '0' : '1';
                let text = enabled === '1' ? '显示' : '隐藏'
                this.$confirm(String(row.pid) === '0' ? '确定' + text + '所有子菜单吗？' : '确定' + text + '该菜单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let array = [row.id]
                    if (String(row.pid) === '0') {
                        this.delMenu(array, row)
                    }
                    let obj = {enabled: enabled, menuIdList: array}
                    this.$api.request(this.$url.AuthorityMenu.updateInMenu, this.$method.put, obj).then(res => {
                        if (res.code === 0) {
                            this.$message.success('菜单状态更新成功')
                            this.loadMenu()
                        }
                    }).catch(() => {
                        this.$message.success('菜单状态更新失败')
                    })
                }).catch(() => {
                    this.$message.info('取消更新')
                })
            },

            updateMenu(tips) { // 暂时通过重新加载菜单的方式来显示修改状态
                this.$message.success(tips)
                this.loadMenu()
            },

            modify(data) { // 修改菜单
                this.addOrEdit = false
                this.keysNode(data)
                this.selectId = data.pid
                this.dialog();
            },

            dialog() {
                this.dialogAddMenu = !this.dialogAddMenu
            },

            remove(data) { // 删除菜单
                this.$confirm(String(data.pid) === '0' ? '删除所有子菜单吗？' : '是否删除该菜单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let array = [data.id]
                    if (String(data.pid) === '0') {
                        this.delMenu(array, data)
                    }
                    this.$api.request(this.$url.AuthorityMenu.delete, this.$method.delete, {menuIdList: array}).then(res => {
                        if (res.code === 0) {
                            this.$message.success('删除成功!')
                            this.loadMenu()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消删除!')
                })
            },

            delMenu(array, data) { // 递归将要删除的菜单及子菜单添加到数组中
                if (data && data.children) {
                    for (let i = 0; i < data.children.length; i++) {
                        array.push(data.children[i].id);
                        let children = data.children[i]
                        if (children.children && children.children.length > 0) {
                            this.delMenu(children.children)
                        }
                    }
                }
            },

            appendNode() { // 开启添加菜单弹框
                this.addOrEdit = true;
                this.selectId = '0'
                this.nodeData.enabled = '1'
                this.nodeData.menuType = '0'
                this.nodeData.sort = this.menuList.length + 1
                this.dialog()
            },

            closeDialogAddMenu(dialogAddMenu) { // 关闭添加菜单弹框
                this.dialogAddMenu = dialogAddMenu
            }

        }
    }
</script>

<style lang="scss">
    @import '~@/assets/scss/tree';
</style>
