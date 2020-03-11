<template>
    <div class="role-auth">
        <el-row>
            <el-col :span="5" class="colSpan">
                <div class="roleFilter">
                    <el-input placeholder="输入角色关键字进行过滤" :clearable="true" v-model="roleFilterText"></el-input>
                </div>
                <el-tree :data="roleList" ref="roleTree" accordion :expand-on-click-node="false"
                         :props="defaultProps" @check-change="checkRoleUserChange" @check="checkRoleUser"
                         :filter-node-method="roleFilterNode" @node-click="nodeRoleUser">
                </el-tree>
            </el-col>
            <el-col :span="19">

            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "RoleAuth"
    }
</script>

<style scoped>

</style>