<template>
    <div class="operation">
        <Search
            :search="search"
            :modelData="modelData"
        />
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
                <el-table-column prop="createTime" label="操作日期" width="160"></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="getOperationInfo(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :current-page="page.currentPage"
                           :total="page.totalSize"
                           :page-size="page.pageSize" @current-change="currentChange"></el-pagination>
        </div>
        <el-dialog title="操作日志详情" :visible="dialogVisible" width="800px" :before-close="handleClose">
            <vue-scroll style="height: 500px">
            <el-form label-position="right" ref="userForm" label-width="90px" size="mini">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="操作模块：">
                            {{operationLog.title}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求地址：">
                            {{operationLog.url}}
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
                            <json-view :data="json.params"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="返回参数：">
                            <json-view :data="json.jsonResult"/>
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
            </vue-scroll>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Search from '@/components/search/Index'
import jsonView from '@/components/json-view/index.vue'

export default {
    name: "Operation",
    components: {
        Search,
        jsonView
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
            multipleSelection: [],
            search: {
                typeSearch: [
                    {
                        label: '操作人员',
                        name: 'operName'
                    },
                    {
                        label: '操作类型',
                        name: 'businessType',
                        dictType: 'sys_oper_type',
                        type: 'select'
                    },
                    {
                        label: '操作时间',
                        type: 'date'
                    }
                ],
                btnSearch: [
                    {
                        btnType: this.$btnType.SAVE,
                        hasPerm: ['sys:dict:add'],
                        name: '增加'
                    },
                    {
                        btnType: this.$btnType.REMOVE,
                        hasPerm: ['sys:dict:delete'],
                        name: '删除'
                    }
                ]
            },
            modelData: {},
            json: {
                jsonResult: Object,
                params: Object
            }
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
            this.$api.request(this.$url.OperationLog.page, this.$method.get, this.$common.objMerge(this.operation, this.page))
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
            try {
                this.json.jsonResult = JSON.parse(row.jsonResult);
                this.json.params = JSON.parse(row.params)
            } catch (e) {
                console.log('非json格式数据')
            }
            this.dialogVisible = true
        },

        handleSelectionChange(row) {
            this.multipleSelection = row
        },

        dictFormat(row) {
            return this.$common.getDictLabel(this.operType, row.businessType);
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
.operation {
  .el-form .el-row {
    margin-left: 0!important;
    margin-right: 0!important;
    .el-col {
      padding-left: 0!important;
      padding-right: 0!important;
    }
  }
}
</style>
