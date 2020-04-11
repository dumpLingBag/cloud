<template>
    <div class="search-message">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-left">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="dialogMessage">发布消息</el-button>
                <el-button type="warning" size="small" v-if="tabIndex === '0'" icon="el-icon-folder-checked">全部标为已读</el-button>
                <el-button type="danger" size="small" v-if="tabIndex === '1'" icon="el-icon-delete">删除全部</el-button>
                <el-button type="danger" size="small" v-if="tabIndex === '2'" icon="el-icon-delete">清空回收站</el-button>
            </div>
            <div class="el-right">
                <el-form ref="operation" :model="message" :inline="true" label-width="10px" size="small"
                         class="demo-form-inline el-input-height">
                    <el-form-item prop="username">
                        <el-input v-model="message.title" placeholder="请输入系统模块"></el-input>
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input v-model="message.operName" placeholder="请输入操作人员"></el-input>
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
                        <el-select v-model="message.status" clearable placeholder="请选择状态">
                            <el-option label="成功" value="0"></el-option>
                            <el-option label="失败" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
                        <el-button @click="resetSearch('operation')" icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchMessage",
        props: {
            message: Object,
            tabIndex: String
        },
        data() {
            return {
                dateTime: ''
            }
        },
        methods: {
            dialogMessage() {
                this.$emit('dialogMessage', true)
            }
        }
    }
</script>

<style scoped>

</style>