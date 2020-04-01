<template>
    <div class="dictionary-data">
        <v-add-dict-data :dialogDict="dialogDict" :addOrEdit="addOrEdit" :dictForm="dictForm" v-on:cancel="cancel"></v-add-dict-data>
        <v-search-dict-data v-on:addDict="addDict" :dict="dict" v-on:onSubmit="onSubmit"
        v-on:enableSelect="enableSelect" v-on:resetSearch="resetSearch"></v-search-dict-data>
        <div class="dict vue-padding radius">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="dictList" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed width="55"></el-table-column>
                <el-table-column prop="dictLabel" label="字典标签"></el-table-column>
                <el-table-column prop="dictValue" label="字典键值"></el-table-column>
                <el-table-column prop="dictSort" label="字典排序"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag size="medium" @click="tagEnable(scope.$index, scope.row)"
                                :type="Number(scope.row.enabled) === 1 ? 'success' : 'warning'">
                            {{ Number(scope.row.enabled) === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="200"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span class="times">{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="editDict(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="delDict(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :current-page="dict.currentPage"
                           :total="dict.totalSize" :page-size="dict.pageSize"
                           @current-change="loadDict"></el-pagination>
        </div>
    </div>
</template>

<script>
    import vAddDictData from '@/components/system/dictData/AddDictData'
    import vSearchDictData from '@/components/system/dictData/SearchDictData'

    export default {
        name: "DictionaryData",
        components: {
            vAddDictData,
            vSearchDictData
        },
        data() {
            return {
                dictList: [],
                dictForm: {
                    dictType: '',
                    dictLabel: '',
                    dictValue: '',
                    dictSort: 1,
                    enabled: '1',
                    remark: ''
                },
                dict: {
                    dictType: '',
                    dictName: '',
                    enabled: '',
                    currentPage: 1,
                    pageSize: 10,
                    totalSize: 0
                },
                dialogDict: false,
                addOrEdit: false,
                loading: false
            }
        },
        mounted() {
            this.dict.dictType = this.$route.params.dictType;
            this.loadDict()
        },
        methods: {
            loadDict() {
                this.loading = true;
                this.$api.request(this.$url.DictData.loadDictData, this.$method.get,  this.dict).then(res => {
                    if (res.code === 0) {
                        this.dictList = res.data
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            },

            addDict() {
                this.dialogDict = true;
                this.addOrEdit = true;
                this.dictForm.dictType = this.dict.dictType;
                this.dictForm.dictSort = this.dictList.length + 1;
            },

            onSubmit(dict) {
                this.dict = dict;
                this.loadDict()
            },

            editDict(row) {
                this.dialogDict = true;
                this.addOrEdit = false;
                Object.keys(this.dictForm).forEach(key => {
                    if (key === 'enabled') {
                        this.dictForm[key] = String(row[key])
                    } else {
                        this.dictForm[key] = row[key]
                    }
                });
                this.dictForm.id = row.id
            },

            delDict(row) {
                this.$confirm('确定要删除该字典数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.request(this.$url.DictData.delete+'/'+row.id, this.$method.delete).then(res => {
                        if (res.code === 0) {
                            this.$message.success('删除字典数据成功');
                            this.loadDict()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消操作')
                })
            },

            enableSelect(enable) {
                this.dict.enabled = enable;
                this.loadDict()
            },

            resetSearch(dict) {
                this.dict = dict;
                this.loadDict()
            },

            cancel(dialogDict, status) {
                this.dialogDict = dialogDict;
                if (status) {
                    this.loadDict()
                }
            }
        }
    }
</script>

<style scoped>

</style>