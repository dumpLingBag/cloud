<template>
    <div class="search-dict">
        <div class="el-search vue-top-padding radius" style="margin-bottom: 10px;">
            <div class="el-left">
                <el-button type="primary" size="small" icon="el-icon-plus" @click="addDict">增加</el-button>
            </div>
            <div class="el-right">
                <el-form ref="dict" :model="dict" :inline="true" label-width="10px" size="small"
                         class="demo-form-inline el-input-height">
                    <el-form-item prop="enable">
                        <el-select v-model="dict.enable" @change="enableSelect($event)" placeholder="字典状态">
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="username">
                        <el-input v-model="dict.dictName" placeholder="请输入字典名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input v-model="dict.dictType" placeholder="请输入字典类型"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" icon="el-icon-search">搜索</el-button>
                        <el-button @click="resetSearch('dict')" icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchDictType",
        props: {
            dict: Object
        },
        methods: {
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
                this.$toolUtil.clearForm(this.dict);
                this.$emit('resetSearch', this.dict)
            }
        }
    }
</script>

<style scoped>

</style>