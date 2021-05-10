<template>
    <div class="search">
        <div class="el-search vue-top-padding radius">
            <div class="title" v-if="search.title">{{ search.title }}</div>
            <div class="content" v-if="search.content">{{ search.content }}</div>
            <el-form ref="search" :model="modelData" :inline="true"
                     v-if="search.typeSearch && search.typeSearch.length > 0" label-width="100px" size="small"
                     class="demo-form-inline el-input-height" :key="key">
                <el-row :gutter="20" type="flex" style="justify-content: flex-end">
                    <template v-for="(item, index) in search.typeSearch">
                        <template v-if="index < 2">
                            <el-col :span="8">
                                <template v-if="!item.type || item.type === ''">
                                    <el-form-item :label="item.label + '：'">
                                        <el-input v-model="modelData[item.name]" :placeholder="item.label"></el-input>
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <el-form-item v-if="item.type === 'input'" :label="item.label + '：'">
                                        <el-input v-model="modelData[item.name]" :placeholder="item.label"></el-input>
                                    </el-form-item>
                                    <el-form-item v-if="item.type === 'select'" :label="item.label + '：'">
                                        <el-select @change="function(e) {return change(e, item)}"
                                                   v-model="modelData[item.name]" filterable :placeholder="item.label">
                                            <template v-if="item.dictType && item.dictType !== ''">
                                                <el-option v-for="op in dictTypeList[item.dictType+'_'+index]"
                                                           :key="op.id" :label="op.dictLabel"
                                                           :value="op.dictValue"></el-option>
                                            </template>
                                            <template v-if="item.urlType && item.urlType !== ''">
                                                <el-option v-for="op in dictTypeList['urlType_'+index]" :key="op.id"
                                                           :label="op[item.key]" :value="op[item.value]"></el-option>
                                            </template>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item v-if="item.type === 'cascader'" :label="item.label + '：'">
                                        <el-cascader
                                            :show-all-levels="false"
                                            :placeholder="item.label"
                                            v-model="modelData[item.name]"
                                            :props="{'value': 'id', 'emitPath': false}"
                                            :options="item.option">
                                        </el-cascader>
                                    </el-form-item>
                                    <el-form-item v-if="item.type === 'date'" :label="item.label + '：'">
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
                                </template>
                            </el-col>
                        </template>
                        <template v-else>
                            <transition name="fade">
                            <template v-if="show">
                                <el-col :span="8">
                                    <template v-if="!item.type || item.type === ''">
                                        <el-form-item :label="item.label + '：'">
                                            <el-input v-model="modelData[item.name]"
                                                      :placeholder="item.label"></el-input>
                                        </el-form-item>
                                    </template>
                                    <template v-else>
                                        <el-form-item v-if="item.type === 'input'" :label="item.label + '：'">
                                            <el-input v-model="modelData[item.name]"
                                                      :placeholder="item.label"></el-input>
                                        </el-form-item>
                                        <el-form-item v-if="item.type === 'select'" :label="item.label + '：'">
                                            <el-select @change="function(e) {return change(e, item)}"
                                                       v-model="modelData[item.name]" filterable
                                                       :placeholder="item.label">
                                                <template v-if="item.dictType && item.dictType !== ''">
                                                    <el-option v-for="op in dictTypeList[item.dictType+'_'+index]"
                                                               :key="op.id" :label="op.dictLabel"
                                                               :value="op.dictValue"></el-option>
                                                </template>
                                                <template v-if="item.urlType && item.urlType !== ''">
                                                    <el-option v-for="op in dictTypeList['urlType_'+index]" :key="op.id"
                                                               :label="op[item.key]"
                                                               :value="op[item.value]"></el-option>
                                                </template>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item v-if="item.type === 'cascader'" :label="item.label + '：'">
                                            <el-cascader
                                                :show-all-levels="false"
                                                :placeholder="item.label"
                                                v-model="modelData[item.name]"
                                                :props="{'value': 'id', 'emitPath': false}"
                                                :options="item.option">
                                            </el-cascader>
                                        </el-form-item>
                                        <el-form-item v-if="item.type === 'date'" :label="item.label + '：'">
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
                                    </template>
                                </el-col>
                            </template>
                            </transition>
                        </template>
                    </template>
                    <el-col :span="show ? (search.typeSearch.length % 3 === 1 ? 16 : 8) : 8" class="el-text-right">
                        <el-button size="small" type="primary" @click="submitSearch">搜索</el-button>
                        <el-button size="small" @click="resetSearch('search')">重置</el-button>
                        <el-button type="text" @click="show = !show">
                            {{ show ? '收起' : '展开' }}
                            <i v-if="show" class="el-icon-arrow-up"></i>
                            <i v-else class="el-icon-arrow-down"></i>
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <div class="el-left" v-if="search.btnSearch.length > 0">
                <template v-for="(item, index) in search.btnSearch">
                    <el-button
                        plain
                        :type="item.btnType.type"
                        :key="index" size="small"
                        v-hasPerm="item.hasPerm"
                        :icon="item.btnType.icon"
                        @click="btnClick(item)"
                    >{{ item.name ? item.name : item.btnType.name }}
                    </el-button>
                </template>
            </div>
        </div>
        <custom-import></custom-import>
    </div>
</template>

<script>
import customImport from '@/components/import/index'

export default {
    name: "searchIndex",
    components: {
        customImport
    },
    props: {
        search: {
            type: Object,
            default() {
                return {}
            }
        },
        modelData: Object
    },
    data() {
        return {
            dateTime: '',
            show: false,
            dictTypeList: {},
            key: ''
        }
    },
    mounted() {
        for (let i = 0; i < this.search.typeSearch.length; i++) {
            if (this.search.typeSearch[i].dictType) {
                this.$api.dict(this.search.typeSearch[i].dictType).then(res => {
                    if (res.code === 0) {
                        this.dictTypeList[this.search.typeSearch[i].dictType + '_' + i] = res.data;
                        this.key = new Date().getTime()
                    }
                })
            } else if (this.search.typeSearch[i].urlType) {
                this.$api.request(this.search.typeSearch[i].urlType, this.$method.get).then(res => {
                    if (res.code === 0) {
                        this.dictTypeList['urlType_' + i] = res.data;
                        this.key = new Date().getTime()
                    }
                })
            }
        }
    },
    methods: {
        btnClick(data) {
            if (data.btnType.event === this.$btnType.EXPORT.event) {
                if (data.url) {
                    this.$confirm('确定导出此页面数据吗？选择顶部条件可导出指定数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$api.download(data.url, this.modelData)
                    }).catch(err => {
                        this.$message.error(err.msg)
                    })
                } else {
                    this.$message.error('数据导出失败')
                }
            } else if (data.btnType.event === this.$btnType.IMPORT.event) {
                console.log('222222')
            } else {
                this.$emit(data.btnType.event, data)
            }
        },
        submitSearch() {
            if (this.dateTime && this.dateTime.length > 0) {
                this.modelData.startTime = this.dateTime[0];
                this.modelData.endTime = this.dateTime[1];
            }
            this.$emit('submitSearch', this.modelData)
        },
        resetSearch(formName) {
            this.$refs[formName].resetFields();
            this.dateTime = '';
            this.$common.clearForm(this.modelData);
            this.$emit('resetSearch', this.modelData)
        },
        change(e, data) {
            this.$emit(data.name + 'Change', e)
        }
    }
}
</script>

<style scoped lang="scss">
.el-row--flex {
    flex-direction: row;
    flex-wrap: wrap;
}

.el-text-right {
    text-align: right;
}

.fade-enter-active {
    transition: all .3s ease-in-out;
}
.fade-leave-active {
    transition: all .3s ease-out;
}
.fade-enter, .fade-leave-to {
    transform: translateY(5px);
    opacity: 0;
}

.el-search {
    transition: all 0.5s;
    .title {
        font-size: 26px;
        margin-bottom: 16px;
    }

    .content {
        color: #909399;
        margin-bottom: 16px;
    }

    .el-button--text {
        font-weight: normal;

        i {
            font-weight: bold;
        }
    }

    .el-date-editor {
        width: 100%;
    }
}
</style>
