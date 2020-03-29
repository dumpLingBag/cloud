<template>
    <div class="authority-oper vue-padding radius">
        <el-table v-loading="loading" element-loading-text="拼命加载中" :data="operList" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="title" label="系统模块"></el-table-column>
            <el-table-column prop="businessType" label="操作类型"></el-table-column>
            <el-table-column prop="requestMethod" label="请求方式"></el-table-column>
            <el-table-column prop="operName" label="操作人员"></el-table-column>
            <el-table-column prop="operIp" label="主机"></el-table-column>
            <el-table-column prop="operLocation" label="操作地点"></el-table-column>
            <el-table-column label="操作状态">
                <template slot-scope="scope">
                    {{scope.row.status === 0 ? '成功' : '失败'}}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="操作日期"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getOperInfo(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :current-page="page.currentPage" :total="page.totalSize" :page-size="page.pageSize" @current-change="currentChange"></el-pagination>
        <el-dialog title="操作日志详情" :visible.sync="dialogVisible" width="50%" :modal-append-to-body='true'
                   :append-to-body="true" :before-close="handleClose">
            <el-form label-position="right" ref="userForm" label-width="90px" size="mini">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="操作模块：">
                            {{operLog.title}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求地址：">
                            {{operLog.operUrl}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录信息：">
                            {{operLog.operName}} / {{operLog.operIp}} / {{operLog.operLocation}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求方式：">
                            {{operLog.requestMethod}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="操作方法：">
                            {{operLog.method}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求参数：">
                            {{operLog.operParam}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="返回参数：">
                            {{operLog.jsonResult}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作状态：">
                            {{operLog.status === 0 ? '正常' : '异常'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作时间：">
                            {{operLog.createTime}}
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
    export default {
        name: "AuthorityOper",
        data() {
            return {
                operList: [],
                dialogVisible: false,
                loading: false,
                operLog: Object,
                page: {
                    pageSize: 10,
                    currentPage: 1,
                }
            }
        },
        mounted() {
            this.currentChange();
        },
        methods: {
            currentChange(currentPage) {
                this.loading = !this.loading;
                this.page.currentPage = currentPage ? currentPage : 1;
                this.$api.request(this.$url.Log.operLogIndex, this.$method.get, this.page).then(res => {
                      if (res.code === 0) {
                        if (res.data && res.data.records) {
                            this.operList = res.data.records;
                            this.page.totalSize = parseInt(res.data.total)
                        }
                    }
                    this.loading = !this.loading;
                }, () => {
                    this.loading = !this.loading;
                })
            },

            getOperInfo(row) {
                this.operLog = row;
                console.log(this.operLog)
                this.dialogVisible = true
            },

            handleClose() {
                this.dialogVisible = false
            }
        }
    }
</script>

<style lang="scss">

</style>