<template>
    <div class="search-dict-data">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-left">
                <el-button type="text" size="small" icon="el-icon-plus" @click="addDict">增加</el-button>
            </div>
            <div class="el-right">
                <el-form ref="dict" :model="dict" :inline="true" label-width="10px" size="small"
                         class="demo-form-inline el-input-height">
                    <el-form-item>
                        <el-select v-model="dict.dictType" filterable placeholder="请选择字典名称">
                            <el-option v-for="item in dictTypeList" :key="item.dictType"
                                    :label="item.dictName" :value="item.dictType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="username">
                        <el-input v-model="dict.dictName" placeholder="请输入字典标签"></el-input>
                    </el-form-item>
                    <el-form-item prop="enable">
                        <el-select v-model="dict.enabled" @change="enableSelect($event)" placeholder="字典状态">
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="text" @click="onSubmit" icon="el-icon-search">搜索</el-button>
                        <el-button @click="resetSearch('dict')" icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchDictData",
    props: {
        dict: Object
    },
    data() {
        return {
            dictTypeList: []
        }
    },
    mounted() {
        this.loadDictType()
    },
    methods: {
        loadDictType() {
            this.$api.request(this.$url.DictType.list, this.$method.get).then(res => {
                if (res.code === 0) {
                    this.dictTypeList = res.data
                }
            })
        },

        addDict() {
            this.$emit('addDict')
        },

        enableSelect(event) {
            this.$emit('enableSelect', event)
        },

        onSubmit() {
            this.$emit('onSubmit', this.dict)
        },

        resetSearch(formName) {
            this.$refs[formName].resetFields(); // 这个只是清除了表单数据，对象并没有重新赋值，所以调用下面的方法赋空值
            this.$common.clearForm(this.dict);
            this.$emit('resetSearch', this.dict)
        }
    }
}
</script>

<style scoped>

</style>
