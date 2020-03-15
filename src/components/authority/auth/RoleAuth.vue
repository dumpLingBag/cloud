<template>
    <div class="role-auth">
        <el-row>
            <el-col :span="5" class="colSpan">
                <div class="roleFilter">
                    <el-input placeholder="输入角色关键字进行过滤" size="small" :clearable="true" v-model="roleFilterText"></el-input>
                </div>
                <el-tree :data="roleList" ref="roleTree" accordion :expand-on-click-node="true"
                         :props="defaultProps" :filter-node-method="roleFilterNode" @node-click="nodeRoleUser">
                </el-tree>
            </el-col>
            <el-col :span="19">

            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "RoleAuth",
        data() {
            return {
                roleFilterText: ''
            }
        },
        props: {
            roleList: Array,
            defaultProps: Object
        },
        watch: {
            roleFilterText(val) {
                this.$refs.roleTree.filter(val);
            }
        },
        methods: {
            roleFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            nodeRoleUser(data) {

            },
        }
    }
</script>

<style scoped>

</style>