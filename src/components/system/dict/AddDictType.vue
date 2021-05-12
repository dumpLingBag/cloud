<template>
    <div class="add-dict-type">
        <el-dialog :title="addOrEdit ? '添加字典' : '编辑字典'" :visible="dialogDict" width="500px"
                   @close="closeDialog" @open="openDialog" :modal-append-to-body='true' :append-to-body="true">
            <el-form :label-position="labelPosition" :rules="rules" ref="dictForm" label-width="80px" :model="dictForm">
                <el-form-item label="字典名称" prop="dictName" :error="error.dictName">
                    <el-input v-model="dictForm.dictName" placeholder="请输入字典名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="字典类型" prop="dictType" :error="error.dictType">
                    <el-input v-model="dictForm.dictType" placeholder="请输入字典类型" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="字典状态" prop="enable">
                    <el-radio-group v-model="dictForm.enabled" size="medium">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注信息">
                    <el-input type="textarea" rows="3" v-model="dictForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="cancel">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitForm('dictForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "AddDictType",
    data() {
        let dictType = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入字典类型'))
            } else {
                const reg = new RegExp(/^[a-z][a-z_]+$/);
                if (!reg.test(value)) {
                    callback(new Error('字典类型只能为小写字母和下划线'))
                }
                if (!this.dictForm.id || this.dictForm.id  === '') {
                    this.getDictType(value, callback)
                } else {
                    if (value !== this.defaultDictType) {
                        this.getDictType(value, callback)
                    } else {
                        callback()
                    }
                }
            }
        };
        return {
            labelPosition: 'right',
            rules: {
                dictName: [
                    {required: true, message: '请输入字典名称', trigger: 'blur'},
                    {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
                ],
                dictType: [
                    {validator: dictType, required: true, trigger: 'blur'}
                ]
            },
            error: {
                dictName: '',
                dictType: '',
            },
            defaultDictType: '',
            clear: false,
        }
    },
    props: {
        addOrEdit: Boolean,
        dialogDict: Boolean,
        dictForm: Object
    },
    mounted() {
        this.clear = false
    },
    methods: {
        closeDialog() {
            this.clearValidate('dictForm');
            if (!this.addOrEdit) {
                this.$common.clearForm(this.dictForm)
            } else {
                if (this.clear) {
                    this.$common.clearForm(this.dictForm)
                }
            }
            this.cancel()
        },

        openDialog() {
            this.defaultDictType = this.dictForm.dictType
        },

        getDictType(dictType, callback) {
            this.$api.request(this.$url.DictType.getDictType + '/' + dictType, this.$method.get).then(res => {
                if (res.code === 0) {
                    if (res.data) {
                        callback(new Error('已存在相同字典类型'))
                    } else {
                        callback()
                    }
                }
            })
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let url = this.$url.DictType.save;
                    let method = this.$method.post;
                    if (this.dictForm.id) {
                        url = this.$url.DictType.update;
                        method = this.$method.put
                    }
                    this.$api.request(url, method, this.dictForm).then(res => {
                        if (res.code === 0) {
                            this.$notify({
                                title: '提示',
                                message: (this.dictForm.id ? '更新': '添加') + '字典成功',
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
