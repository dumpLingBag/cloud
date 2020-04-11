<template>
    <div class="sys-auth vue-padding radius">
        <div class="tips">{{$route.name}}</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户角色设置" name="userRole">
                <user-role :roleList="roleList"></user-role>
            </el-tab-pane>
            <el-tab-pane label="角色权限设置" name="userAuth">
                <role-auth :roleList="roleList"></role-auth>
            </el-tab-pane>
            <el-tab-pane label="用户部门设置" name="userDept">
                <user-dept></user-dept>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import roleAuth from "@/components/authority/auth/RoleAuth";
    import userDept from "@/components/authority/auth/UserDept";
    import userRole from "@/components/authority/auth/UserRole";

    export default {
        name: 'Authorization',
        components: {
            roleAuth, userRole, userDept
        },
        inject: ['reload'],
        data() {
            return {
                activeName: 'userRole',
                roleList: [],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                }
            }
        },
        mounted() {
            this.$api.request(this.$url.AuthorityRole.loadRole, this.$method.get).then(res => {
                if (res.code === 0) {
                    this.roleList = res.data
                } else {
                    this.$message.error(res.msg)
                }
            }).catch(() => {
                this.$message.error('角色加载失败')
            })
        },
        methods: {
            handleClick(tab) {

            }
        }
    }
</script>

<style lang="scss">
    .sys-auth {
        .el-input {
            width: 100%;
            margin-bottom: 10px;
        }

        .roleFilter,.authFilter {
            padding-left: 20px;
            margin-bottom: 10px
        }

        .el-tree-node__content {
            height: 2rem;
            line-height: 2rem;
        }
    }
</style>
