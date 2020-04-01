<template>
    <div class="search-user">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-left">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="addUser">增加</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" v-hasPerm="['sys:user:add']" :disabled="multipleSelection.length <= 0" @click="delBatchUser">删除</el-button>
                <el-button type="primary" size="small" icon="el-icon-finished" @click="userStyle">切换样式</el-button>
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
            onSubmit() {
                this.$emit('onSubmit', this.page)
            },
            resetSearch(formName) {
                this.$refs[formName].resetFields(); // 这个只是清除了表单数据，对象并没有重新赋值，所以调用下面的方法赋空值
                this.$toolUtil.clearForm(this.page.search);
                this.$emit('resetSearch', this.page)
            },
            enableSelect(event) {
                this.$emit('enableSelect', event)
            },
            userStyle() {

            },
            addUser() {
                this.$emit('addUser')
            },
            delBatchUser() {
                this.$emit('delBatchUser')
            }
        }
    }
</script>

<style scoped>

</style>