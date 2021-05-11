<template>
    <div class="dictionary-data">
        <AddDictData
                :dialogDict="dialogDict"
                :addOrEdit="addOrEdit"
                :dictForm="dictForm"
                v-on:cancel="cancel"
        />
        <Search
                :search="search"
                :modelData="modelData"
                @saveChange="addDict"
                @dictTypeChange="dictTypeChange"
        />
        <div class="dict vue-padding radius">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="dictList" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed width="55"></el-table-column>
                <el-table-column prop="dictLabel" label="字典标签"></el-table-column>
                <el-table-column prop="dictValue" label="字典键值"></el-table-column>
                <el-table-column prop="dictSort" label="字典排序"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag size="small" @click="tagEnable(scope.$index, scope.row)"
                                :type="Number(scope.row.enabled) === 1 ? 'success' : 'warning'">
                            {{ Number(scope.row.enabled) === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span class="times">{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editDict(scope.row)">编辑</el-button>
                        <div class="el-divider el-divider-vertical el-divider-default"></div>
                        <el-button type="text" @click="delDict(scope.row)">删除</el-button>
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
import AddDictData from '@/components/system/dict/AddDictData'
import Search from '@/components/search/Index'

export default {
    name: "DictionaryData",
    components: {
        AddDictData,
        Search
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
            loading: false,
            search: {
                typeSearch: [
                    {
                        label: '字典类型',
                        name: 'dictType',
                        urlType: this.$url.DictType.list,
                        type: 'select',
                        key: 'dictName',
                        value: 'dictType'
                    },
                    {
                        label: '字典名称',
                        name: 'dictName'
                    },
                    {
                        label: '字典状态',
                        name: 'dictStatus',
                        dictType: 'sys_yes_no',
                        type: 'select'
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
            modelData: {
                dictType: ''
            }
        }
    },
    mounted() {
        this.dict.dictType = this.$route.params.dictType;
        this.modelData.dictType = this.$route.params.dictType;
        this.loadDict()
    },
    methods: {
        loadDict() {
            this.loading = true;
            this.$api.request(this.$url.DictData.loadDictData, this.$method.get, this.dict).then(res => {
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
                this.$api.request(this.$url.DictData.delete + '/' + row.id, this.$method.delete).then(res => {
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
        },

        dictTypeChange(data) {

        },

        handleSelectionChange() {

        },

        tagEnable(index, data) {

        }
    }
}
</script>

<style scoped>

</style>
