<template>
    <div class="authority-login-info">
        <v-search-login-info :loginInfo="loginInfo" v-on:onSubmit="onSubmit" v-on:resetSearch="resetSearch"
            :multipleSelection="multipleSelection" v-on:update="update"></v-search-login-info>
        <div class="vue-padding radius">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="logList" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="username" label="用户名称"></el-table-column>
                <el-table-column prop="ipAddress" label="登录地址"></el-table-column>
                <el-table-column prop="loginLocation" label="登录地点"></el-table-column>
                <el-table-column prop="browser" label="浏览器"></el-table-column>
                <el-table-column prop="os" label="操作系统"></el-table-column>
                <el-table-column label="登录状态">
                    <template slot-scope="scope">
                        {{scope.row.status === 0 ? '成功' : '失败'}}
                    </template>
                </el-table-column>
                <el-table-column prop="message" :show-overflow-tooltip="true" label="操作信息"></el-table-column>
                <el-table-column prop="createTime" label="登录日期"></el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :current-page="page.currentPage" :total="page.totalSize"
                :page-size="page.pageSize" @current-change="currentChange"></el-pagination>
        </div>
    </div>
</template>

<script>
    import vSearchLoginInfo from '@/components/authority/log/SearchLoginInfo'
    export default {
        name: "AuthorityLoginInfo",
        components: {
            vSearchLoginInfo
        },
        data() {
            return {
                logList: [],
                loading: false,
                page: {
                    pageSize: 10,
                    currentPage: 1,
                },
                loginInfo: {
                    loginLocation: '',
                    username: '',
                    status: '',
                    startTime: '',
                    endTime: ''
                },
                multipleSelection: []
            }
        },
        mounted() {
            this.currentChange();
        },
        methods: {
            currentChange(currentPage) {
                this.loading = !this.loading;
                this.page.currentPage = currentPage ? currentPage : 1;
                this.$api.request(this.$url.LoginInfo.page, this.$method.get, this.$cloud.objMerge(this.loginInfo, this.page)).then(res => {
                    if (res.code === 0) {
                        if (res.data && res.data.records) {
                            this.logList = res.data.records;
                            this.page.totalSize = parseInt(res.data.total)
                        }
                    }
                    this.loading = !this.loading;
                }, () => {
                    this.loading = !this.loading;
                })
            },

            handleSelectionChange(row) {
                this.multipleSelection = row
            },

            onSubmit() {
                this.currentChange()
            },

            resetSearch() {
                this.currentChange()
            },

            update() {
                this.currentChange()
            }
        }
    }
</script>

<style scoped>

</style>