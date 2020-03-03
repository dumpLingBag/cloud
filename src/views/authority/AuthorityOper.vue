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
                <el-button size="mini" @click="getOperInfo(scope.row)">详情</el-button>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :current-page="page.currentPage" :total="page.totalSize" :page-size="page.pageSize" @current-change="currentChange"></el-pagination>
    </div>
</template>

<script>
    export default {
        name: "AuthorityOper",
        data() {
            return {
                operList: [],
                loading: false,
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
                    console.log(res)
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
            }
        }
    }
</script>

<style scoped>

</style>