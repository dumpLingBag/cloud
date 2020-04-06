<template>
    <div class="operation">
        <v-search-operation :operation="operation" :operType="operType" v-on:onSubmit="onSubmit"
        v-on:resetSearch="resetSearch" :multipleSelection="multipleSelection"></v-search-operation>
        <div class="vue-padding radius">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="operationList" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="title" label="系统模块"></el-table-column>
                <el-table-column prop="businessType" label="操作类型" :formatter="dictFormat"></el-table-column>
                <el-table-column prop="requestMethod" label="请求方式"></el-table-column>
                <el-table-column prop="operationName" label="操作人员"></el-table-column>
                <el-table-column prop="operationIp" label="主机"></el-table-column>
                <el-table-column prop="operationLocation" label="操作地点"></el-table-column>
                <el-table-column label="操作状态">
                    <template slot-scope="scope">
                        {{scope.row.status === 0 ? '成功' : '失败'}}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="操作日期"></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="getOperationInfo(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :current-page="page.currentPage"
                           :total="page.totalSize"
                           :page-size="page.pageSize" @current-change="currentChange"></el-pagination>
        </div>
        <el-dialog title="操作日志详情" :visible.sync="dialogVisible" width="50%" :modal-append-to-body='true'
                   :append-to-body="true" :before-close="handleClose">
            <el-form label-position="right" ref="userForm" label-width="90px" size="mini">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="操作模块：">
                            {{operationLog.title}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求地址：">
                            {{operationLog.operationUrl}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录信息：">
                            {{operationLog.operationName}} / {{operationLog.operationIp}} / {{operationLog.operationLocation}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求方式：">
                            {{operationLog.requestMethod}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="操作方法：">
                            {{operationLog.method}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求参数：">
                            {{operationLog.operationParam}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="返回参数：">
                            {{operationLog.jsonResult}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作状态：">
                            {{operationLog.status === 0 ? '正常' : '异常'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作时间：">
                            {{operationLog.createTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import vSearchOperation from '@/components/authority/log/SearchOperation'

    export default {
        name: "Operation",
        components: {
            vSearchOperation
        },
        data() {
            return {
                operationList: [],
                dialogVisible: false,
                loading: false,
                operationLog: Object,
                page: {
                    pageSize: 10,
                    currentPage: 1
                },
                operation: {
                    title: '',
                    operName: '',
                    businessType: '',
                    startTime: '',
                    endTime: '',
                    status: ''
                },
                operType: [],
                multipleSelection: []
            }
        },
        mounted() {
            this.currentChange();
            this.listDict()
        },
        methods: {
            listDict() {
                this.$api.dict('sys_oper_type').then(res => {
                    if (res.code === 0) {
                        this.operType = res.data
                    }
                })
            },

            currentChange(currentPage) {
                this.loading = !this.loading;
                this.page.currentPage = currentPage ? currentPage : 1;
                this.$api.request(this.$url.OperationLog.page, this.$method.get, this.$cloud.objMerge(this.operation, this.page))
                    .then(res => {
                        if (res.code === 0) {
                            if (res.data && res.data.records) {
                                this.operationList = res.data.records;
                                this.page.totalSize = parseInt(res.data.total)
                            }
                        }
                        this.loading = !this.loading;
                    }, () => {
                        this.loading = !this.loading;
                    })
            },

            getOperationInfo(row) {
                this.operationLog = row;
                this.dialogVisible = true
            },

            handleSelectionChange(row) {
                this.multipleSelection = row
            },

            dictFormat(row) {
                return this.$cloud.getDictLabel(this.operType, row.businessType);
            },

            handleClose() {
                this.dialogVisible = false
            },

            onSubmit() {
                this.currentChange()
            },

            resetSearch() {
                this.currentChange()
            }
        }
    }
</script>

<style lang="scss">

</style>