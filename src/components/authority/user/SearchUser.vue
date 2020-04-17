<template>
    <div class="search-user">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-left">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="addUser">增加</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" v-hasPerm="['sys:user:add']" :disabled="multipleSelection.length <= 0" @click="delBatchUser">删除</el-button>
                <el-button type="success" size="small" icon="el-icon-bottom" v-hasPerm="['sys:user:export']" @click="exportUser">导出</el-button>
                <el-button type="warning" size="small" icon="el-icon-top" v-hasPerm="['sys:user:import']" @click="importUser">导入</el-button>
            </div>
            <div class="el-right">
                <el-form ref="page" :model="page.search" :inline="true" label-width="10px" size="small"
                         class="demo-form-inline el-input-height">
                    <el-form-item prop="enabled">
                        <el-select v-model="page.search.enabled" @change="enableSelect($event)" placeholder="请选择状态">
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="username">
                        <el-input v-model="page.search.username" placeholder="请输入用户账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input v-model="page.search.nickname" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
                        <el-button @click="resetSearch('page')" icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchUser",
        data() {
            return {}
        },
        props: {
            page: Object,
            multipleSelection: Array
        },
        methods: {
            // 搜索
            onSubmit() {
                this.$emit('onSubmit', this.page)
            },
            // 重置
            resetSearch(formName) {
                this.$refs[formName].resetFields(); // 这个只是清除了表单数据，对象并没有重新赋值，所以调用下面的方法赋空值
                this.$toolUtil.clearForm(this.page.search);
                this.$emit('resetSearch', this.page)
            },
            // 启用禁用
            enableSelect(event) {
                this.$emit('enableSelect', event)
            },
            // 添加用户
            addUser() {
                this.$emit('addUser')
            },
            // 批量删除用户
            delBatchUser() {
                this.$emit('delBatchUser')
            },
            // 导出用户
            exportUser() {
                this.$confirm('确定要导出用户列表吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('exportUser')
                })
            },
            // 导入用户
            importUser() {
                this.$emit('importUser')
            }
        }
    }
</script>

<style scoped>

</style>