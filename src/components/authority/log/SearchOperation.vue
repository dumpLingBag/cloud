<template>
    <div class="search-operation el-search vue-top-padding radius">
        <div class="search-simple">
            <div class="el-left">
                <el-button type="danger" size="small" icon="el-icon-delete" :disabled="multipleSelection.length <= 0" @click="delBatchOperation">删除</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="clearOperation">清空</el-button>
            </div>
            <div class="el-right">
                <el-form ref="operation" :model="operation" :inline="true" label-width="10px" size="small"
                         class="demo-form-inline el-input-height">
                    <el-form-item prop="username">
                        <el-input v-model="operation.title" placeholder="请输入系统模块"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="text" @click="onSubmit" icon="el-icon-search">搜索</el-button>
                        <el-button @click="resetSearch('operation')" icon="el-icon-refresh">重置</el-button>
                        <el-button type="info" size="small" icon="el-icon-delete" @click="searchMore">高级</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <transition name="el-zoom-in-top">
            <div class="search-more" v-if="more">
                <el-form ref="operation" :model="operation" :inline="true" label-width="10px" size="small"
                         class="demo-form-inline el-input-height">
                    <el-form-item label="操作人员">
                        <el-input v-model="operation.operName" placeholder="请输入操作人员"></el-input>
                    </el-form-item>
                    <el-form-item label="操作类型">
                        <el-select v-model="operation.businessType" filterable clearable placeholder="操作类型">
                            <el-option
                                    v-for="item in operType"
                                    :key="item.dictValue"
                                    :label="item.dictLabel"
                                    :value="item.dictValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作时间">
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
                    <el-form-item label="转态">
                        <el-select v-model="operation.status" clearable placeholder="请选择状态">
                            <el-option label="成功" value="0"></el-option>
                            <el-option label="失败" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "SearchOperation",
        props: {
            operation: Object,
            operType: Array,
            multipleSelection: Array
        },
        data() {
            return {
                operationList: [],
                dateTime: '',
                more: false
            }
        },
        methods: {
            onSubmit() {
                if (this.dateTime && this.dateTime.length > 0) {
                    this.operation.startTime = this.dateTime[0];
                    this.operation.startTime = this.dateTime[1];
                }
                this.$emit('onSubmit')
            },

            resetSearch(formName) {
                this.$refs[formName].resetFields(); // 这个只是清除了表单数据，对象并没有重新赋值，所以调用下面的方法赋空值
                this.$common.clearForm(this.operation);
                this.dateTime = '';
                this.$emit('resetSearch', this.operation)
            },

            // 删除操作日志
            delBatchOperation() {
                this.$confirm('是否要删除选中操作日志？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.request(this.$url.OperationLog.delete, this.$method.delete, {ids: this.$common.getIds(this.multipleSelection)}).then(res => {
                        if (res.code === 0) {
                            this.$notify({
                                title: '提示',
                                message: '成功删除选中操作日志',
                                type: 'success'
                            });
                            this.$emit('update')
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消操作')
                })
            },

            // 清空操作日志
            clearOperation() {
                this.$confirm('是否要清空操作日志？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.request(this.$url.OperationLog.clear, this.$method.delete).then(res => {
                        if (res.code === 0) {
                            this.$notify({
                                title: '提示',
                                message: '成功清空操作日志',
                                type: 'success'
                            });
                            this.$emit('update')
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消操作')
                })
            },
            searchMore() {
                this.more = !this.more
            }
        }
    }
</script>

<style>

</style>
