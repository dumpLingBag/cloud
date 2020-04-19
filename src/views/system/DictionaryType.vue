<template>
    <div class="dictionary">
        <v-search-dict v-on:addDict="addDict" :dict="dict" v-on:onSubmit="onSubmit" v-on:delBatchDict="delBatchDict"
        v-on:enableSelect="enableSelect" v-on:resetSearch="resetSearch" :multipleSelection="multipleSelection"></v-search-dict>
        <v-add-dict :dialogDict="dialogDict" :addOrEdit="addOrEdit" :dictForm="dictForm" v-on:cancel="cancel"></v-add-dict>
        <div class="dict vue-padding radius">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="dictList" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed width="55"></el-table-column>
                <el-table-column prop="dictName" label="字典名称"></el-table-column>
                <el-table-column label="字典类型">
                    <template slot-scope="scope">
                        <router-link :to="'/dictionary-data/'+scope.row.dictType" class="link-type">{{scope.row.dictType}} </router-link>
                    </template>
                </el-table-column>
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
    import vSearchDict from '@/components/system/SearchDictType'
    import vAddDict from '@/components/system/AddDictType'
    export default {
        name: "DictionaryType",
        components: {
            vSearchDict,
            vAddDict
        },
        data() {
            return {
                dictList: [],
                dict: {
                    dictName: '',
                    dictType: '',
                    enabled: '',
                    currentPage: 1,
                    pageSize: 10,
                    totalSize: 0
                },
                loading: false,
                dialogDict: false,
                addOrEdit: false,
                dictForm: {
                    dictName: '',
                    dictType: '',
                    enabled: '1',
                    remark: ''
                },
                multipleSelection: []
            }
        },
        mounted() {
            this.loadDict()
        },
        methods: {
            loadDict() {
                this.loading = true;
                this.$api.request(this.$url.DictType.loadDictType, this.$method.get, this.dict).then(res => {
                    if (res.code === 0) {
                        this.dictList = res.data.records
                    }
                    this.loading = false
                }).catch(() => {
                    this.loading = false;
                })
            },

            addDict() {
                this.dialogDict = true;
                this.addOrEdit = true
            },

            enableSelect(enable) {
                this.dict.enabled = enable;
                this.loadDict()
            },

            resetSearch(dict) {
                this.dict = dict;
                this.loadDict()
            },

            onSubmit(dict) {
                this.dict = dict;
                this.loadDict()
            },

            handleSelectionChange(row) {
                this.multipleSelection = row
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
                this.$confirm('确定要删除该字典吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.request(this.$url.DictType.delete, this.$method.delete, {dictTypeId: [row.id]}).then(res => {
                        if (res.code === 0) {
                            this.$message.success('删除字典成功');
                            this.loadDict()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消操作')
                })
            },

            cancel(dialogDict, status) {
                this.dialogDict = dialogDict;
                if (status) {
                    this.loadDict()
                }
            },
            // 批量删除
            delBatchDict() {
                if (this.multipleSelection.length > 0) {
                    this.$confirm('确定要删除选中的字典吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let dictTypeIds = this.getDictTypeId(this.multipleSelection);
                        this.$api.request(this.$url.DictType.delete, this.$method.delete,
                            {dictTypes: dictTypeIds}).then(res => {
                            if (res.code === 0) {
                                this.$notify({
                                    title: '成功',
                                    message: '删除字典成功',
                                    type: 'success'
                                });
                                this.loadDict()
                            }
                        })
                    }).catch(() => {
                        this.$message.info('取消操作')
                    })
                }
            },

            getDictTypeId(selectIds) {
                let obj = [];
                selectIds.forEach(key => {
                    obj.push(key.dictType)
                });
                return obj;
            }
        }
    }
</script>

<style lang="scss">
    .dictionary {
        .link-type:link {
            color: #337ab7;
        }
        .link-type:visited {
            color: #337ab7;
        }
    }
</style>