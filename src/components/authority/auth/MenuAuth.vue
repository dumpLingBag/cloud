<template>
    <div class="menu-auth">
        <el-dialog
            title="分配菜单权限"
            :visible="dialogVisible"
            top="50px"
            @close="closeDialog"
            width="40%" @open="openMenuAuth">
            <div :style="{height: height + 'px'}">
                <vue-scroll>
                    <el-tree
                            :data="menuList"
                            :props="defaultProps"
                            show-checkbox
                            ref="menuAuth"
                            node-key="id"
                            :check-strictly="true"
                            :default-expand-all="true"
                            icon-class="el-icon-arrow-right"
                            @node-click="handleNodeClick"
                    ></el-tree>
                </vue-scroll>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="selectMenu">{{selectIds.length > 0 ? '全部取消' : '全部选择'}}</el-button>
                <el-button size="medium" type="primary" @click="submitAuth">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "MenuAuth",
    props: {
        dialogVisible: Boolean,
        roleId: String
    },
    data() {
        return {
            menuList: [],
            defaultProps: {
                label: 'name',
                children: 'children'
            },
            height: 0,
            checks: [],
            selectIds: []
        }
    },
    watch: {
        menuList: function (newVal) {
            if (newVal && this.checks) {
                this.$refs.menuAuth.setCheckedKeys(this.checks, false)
            }
        },
        checks: function (newVal) {
            if (newVal && this.menuList) {
                this.$refs.menuAuth.setCheckedKeys(newVal, false)
            }
        }
    },
    mounted() {
        let height = document.documentElement.clientHeight;
        this.height = height - 280;
    },
    methods: {
        openMenuAuth() {
            this.listMenu();
            this.listMenuChecked()
        },

        listMenu() {
            this.$api.request(this.$url.AuthorityMenu.list).then(res => {
                if (res.code === 0) {
                    this.menuList = res.data
                }
            })
        },

        listMenuChecked() {
            this.$api.request(this.$url.AuthorityRoleMenu.listCheckMenu, this.$method.get, {roleId: this.roleId}).then(res => {
                if (res.code === 0) {
                    this.checks = res.data
                }
            })
        },

        cancel() {
            this.$emit('cancel', false)
        },

        submitAuth() {
            let ids = this.$refs.menuAuth.getCheckedNodes(false, true);
            let obj = {roleId: this.roleId, menuId: this.$common.getIds(ids)}
            this.$api.request(this.$url.AuthorityRoleMenu.save, this.$method.post, obj).then(res => {
                if (res.code === 0) {
                    this.$notify({
                        title: '提示',
                        message: '更新权限成功',
                        type: 'success'
                    });
                }
            })
        },

        handleNodeClick() {

        },

        closeDialog() {
            this.cancel()
        },

        /**
         * 递归获取所有菜单id
         */
        recursion(data, ids) {
            data.forEach(key => {
                ids.push(key.id);
                if (key.children) {
                    this.recursion(key.children, ids)
                }
            });
            return ids;
        },

        selectMenu() {
            if (this.selectIds.length > 0) {
                this.selectIds = []
            } else {
                this.selectIds = this.recursion(this.menuList, this.selectIds);
            }
            this.$refs.menuAuth.setCheckedKeys(this.selectIds, false)
        }
    }
}
</script>

<style lang="scss">
    .menu-auth {
      .el-tree {
        color: #515a6e;
        .el-icon-arrow-right {
          font-size: 14px;
          font-weight: 600;
        }
        .el-tree-node__expand-icon {
          color: #515a6e;
        }
        .el-tree-node__expand-icon.is-leaf {
          color: transparent;
        }
        .el-tree-node__content {
          height: 30px;
        }
      }
      .el-checkbox__inner {
        width: 16px;
        height: 16px;
        margin-bottom: 2px!important;
      }
      .el-checkbox__inner::after {
        top: 2px;
        left: 5px;
      }
      .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        top: 6px;
      }
    }
</style>
