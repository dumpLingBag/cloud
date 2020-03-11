<template>
    <div class="user-role">
        <el-row>
            <el-col :span="5" class="colSpan">
                <div class="roleFilter">
                    <el-input placeholder="输入角色关键字进行过滤" :clearable="true" v-model="userFilterText"></el-input>
                </div>
                <el-tree :data="roleList" ref="userTree" accordion :expand-on-click-node="false"
                         :props="defaultProps" @check-change="checkRoleUserChange" @check="checkRoleUser"
                         :filter-node-method="userFilterNode" @node-click="nodeRoleUser">
                </el-tree>
            </el-col>
            <el-col :span="19">222</el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "UserRole"
    }
</script>

<style scoped>

</style>