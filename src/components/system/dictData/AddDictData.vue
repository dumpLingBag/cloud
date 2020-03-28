<template>
    <div class="add-dict-data">
        <el-dialog :title="addOrEdit ? '添加字典数据' : '编辑字典数据'" :visible.sync="dialogDict" width="30%"
                   @closed="closeDialog" :modal-append-to-body='true' :append-to-body="true">
            <el-form :label-position="labelPosition" :rules="rules" ref="dictForm" label-width="80px" :model="dictForm">
                <el-form-item label="字典类型" prop="dictType" :error="error.dictName">
                    <el-input v-model="dictForm.dictType" disabled="disabled" placeholder="请输入字典类型" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="数据标签" prop="dictLabel" :error="error.dictType">
                    <el-input v-model="dictForm.dictLabel" placeholder="请输入数据标签" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="数据键值" prop="dictValue" :error="error.dictType">
                    <el-input v-model="dictForm.dictValue" placeholder="请输入数据键值" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="字典排序" prop="dictSort" :error="error.dictType">
                    <el-input-number v-model="dictForm.dictSort" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="字典状态" prop="enabled">
                    <el-radio-group v-model="dictForm.enabled" size="medium">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注信息">
                    <el-input type="textarea" v-model="dictForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm('dictForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AddDictData",
        data() {
            return {
                labelPosition: 'right',
                rules: {
                    dictLabel: [
                        {required: true, message: '请输入请输入数据标签', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ],
                    dictValue: [
                        {required: true, message: '请输入数据键值', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ]
                },
                error: {
                    dictName: '',
                    dictType: '',
                },
                clear: false,
            }
        },
        props: {
            addOrEdit: Boolean,
            dialogDict: Boolean,
            dictForm: Object
        },
        mounted() {
            this.clear = false;
        },
        methods: {
            closeDialog() {
                this.clearValidate('dictForm');
                if (!this.addOrEdit) {
                    this.$toolUtil.clearForm(this.dictForm)
                } else {
                    if (this.clear) {
                        this.$toolUtil.clearForm(this.dictForm)
                    }
                }
                this.cancel()
            },

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = this.$url.DictData.save;
                        let method = this.$method.post;
                        if (this.dictForm.id) {
                            url = this.$url.DictData.update;
                            method = this.$method.put
                        }
                        this.$api.request(url, method, this.dictForm).then(res => {
                            if (res.code === 0) {
                                this.$notify({
                                    title: '提示',
                                    message: (this.dictForm.id ? '更新': '添加') + '字典数据成功',
                                    type: 'success'
                                });
                                this.clear = true;
                                this.cancel(this.dictForm.id ? 'update' : 'save')
                            }
                        })
                    } else {
                        return false
                    }
                })
            },

            cancel(status, code) {
                this.$emit('cancel', false, status, code)
            },

            // 清除表单校验信息
            clearValidate(formName) {
                this.$refs[formName].clearValidate()
            }
        }
    }
</script>

<style scoped>

</style>