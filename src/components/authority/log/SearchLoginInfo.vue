<template>
    <div class="search-login-info">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-right">
                <el-form ref="loginInfo" :model="loginInfo" :inline="true" label-width="10px" size="small"
                         class="demo-form-inline el-input-height">
                    <el-form-item prop="username">
                        <el-input v-model="loginInfo.loginLocation" placeholder="请输入登录地址"></el-input>
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input v-model="loginInfo.username" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                                v-model="dateTime"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="enabled">
                        <el-select v-model="loginInfo.status" clearable placeholder="请选择状态">
                            <el-option label="成功" value="0"></el-option>
                            <el-option label="失败" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
                        <el-button @click="resetSearch('loginInfo')" icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchLoginInfo",
        props: {
            loginInfo: Object
        },
        data() {
            return {
                dateTime: ''
            }
        },
        methods: {
            onSubmit() {
                if (this.dateTime && this.dateTime.length > 0) {
                    this.loginInfo.startTime = this.dateTime[0];
                    this.loginInfo.endTime = this.dateTime[1];
                }
                this.$emit('onSubmit')
            },

            resetSearch(formName) {
                this.$refs[formName].resetFields(); // 这个只是清除了表单数据，对象并没有重新赋值，所以调用下面的方法赋空值
                this.$toolUtil.clearForm(this.loginInfo);
                this.dateTime = '';
                this.$emit('resetSearch')
            }
        }
    }
</script>

<style scoped>

</style>