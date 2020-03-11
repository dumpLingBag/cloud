<template>
    <div class="sys-auth vue-padding radius">
        <div class="tips">{{$route.name}}</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户角色设置" name="userRole">
                <user-role></user-role>
            </el-tab-pane>
            <el-tab-pane label="角色权限设置" name="userAuth">
                <role-auth></role-auth>
            </el-tab-pane>
            <el-tab-pane label="用户部门设置" name="userDept">
                <user-dept></user-dept>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import roleAuth from "../../components/authority/auth/RoleAuth";
    import userDept from "../../components/authority/auth/UserDept";
    import userRole from "../../components/authority/auth/UserRole";

    export default {
        name: 'AuthorityAuth',
        components: {
            roleAuth, userRole, userDept
        },
        watch: {
            userFilterText(val) {
                this.$refs.userTree.filter(val);
            },
            roleFilterText(val) {
                this.$refs.roleTree.filter(val);
            }
        },
        data() {
            return {
                activeName: 'userRole',
                roleList: [],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },
                checkRoleUserName: '',
                userFilterText: '',
                roleFilterText: ''
            }
        },
        mounted() {
            this.$api.request(this.$url.AuthorityRole.loadRole, this.$method.get).then(res => {
                if (res.code === 0) {
                    this.roleList = res.data
                }
            }).catch(() => {

            })
        },
        methods: {
            handleClick(tab) {
                console.log(tab.index)
            },
            nodeRoleUser(data) {
                console.log(data)
            },
            checkRoleUser(data) {
                console.log('11111')
            },
            checkRoleUserChange(data) {
                console.log(data)
            },
            userFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            roleFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        }
    }
</script>

<style lang="scss">
    .sys-auth {
        .el-input {
            margin-bottom: 10px;
        }

        .colSpan {
            border-right: 1px solid rgba(235, 235, 235, 1);
        }

        .roleFilter {
            padding: 0 20px;
            margin-bottom: 10px
        }

        .el-tree-node__content {
            height: 2.5rem;
            line-height: 2.5rem;
        }

        .el-tree-node__content:hover {
            color: rgb(16, 142, 233);
            border-right: 2px solid rgb(16, 142, 233);
            background-color: rgba(230, 247, 255, 1);
        }

        .is-current {
            .el-tree-node__content {
                color: rgb(16, 142, 233);
                border-right: 2px solid rgb(16, 142, 233);
                background-color: rgba(230, 247, 255, 1) !important;
            }
        }
    }
</style>
