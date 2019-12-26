<template>
    <div class="addUser">
        <el-dialog :title="addOrEdit ? '添加用户' : '编辑用户'" v-dialogDrag :visible.sync="dialogUser" width="50%" @closed="closeDialog" :modal-append-to-body='false'>
            <el-form :label-position="labelPosition" :rules="rules" ref="userForm" label-width="80px" :model="userForm">
                <el-form-item label="用户名称" prop="nickname" :error="error.nickname">
                    <el-input v-model="userForm.nickname" placeholder="请输入用户名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号名称" prop="username" :error="error.username">
                    <el-input v-model="userForm.username" placeholder="请输入账号名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号密码" prop="password" v-if="addOrEdit">
                    <el-input type="password" v-model="userForm.password" placeholder="请输入账号密码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword" v-if="addOrEdit">
                    <el-input type="password" v-model="userForm.checkPassword" placeholder="请再次输入账号密码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="userForm.email" placeholder="请输入用户邮箱" :error="error.email"></el-input>
                </el-form-item>
                <el-form-item label="用户号码" prop="mobile" :error="error.mobile">
                    <el-input v-model="userForm.mobile" placeholder="请输入用户号码"></el-input>
                </el-form-item>
                <el-form-item label="账号状态" prop="enable">
                    <el-radio-group v-model="userForm.enable" :disabled="!addOrEdit && userForm.parentId === '0'" size="medium">
                        <el-radio border label="1">启用</el-radio>
                        <el-radio border label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm('userForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AddUser",
        data() {
            const password = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    const reg = new RegExp('(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$');
                    if (!reg.test(value)) {
                        callback(new Error('密码必须包含大小写字母数字，长度为6~16位'))
                    }
                    if (this.userForm.checkPassword !== '') {
                        this.$refs.userForm.validateField('checkPassword')
                    }
                    callback()
                }
            };
            const checkPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.userForm.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            };
            const mobile = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号码'))
                } else {
                    const reg = new RegExp('^((13\\d)|(14[5-9])|(15[0-35-9])|(166)|(17[0-8])|(18\\d)|(19[8-9]))\\d{8}$');
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的手机号码'))
                    }
                    callback()
                }
            };
            return {
                error: {
                    nickname: '',
                    username: '',
                    mobile: '',
                    email: ''
                },
                labelPosition: 'left',
                rules: {
                    nickname: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入账号名称', trigger: 'blur' },
                        { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { validator: password, trigger: 'blur' },
                        { required: true, trigger: 'blur' }
                    ],
                    checkPassword: [
                        { validator: checkPassword, trigger: 'blur' },
                        { required: true, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                    ],
                    mobile: [
                        { validator: mobile, required: true, trigger: 'blur' }
                    ],
                    enable: [
                        { required: true, message: '请选择账号状态', trigger: 'blur' }
                    ]
                },
            }
        },
        props: {
            dialogUser: Boolean,
            addOrEdit: Boolean, // 添加或者编辑用户
            userForm: Object
        },
        methods: {
            // 添加或编辑用户
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const obj = {};
                        Object.keys(this.userForm).forEach(key => {
                            obj[key] = this.userForm[key]
                        });
                        if (this.addOrEdit) {
                            obj.password = this.$md5(obj.password);
                            obj.checkPassword = this.$md5(obj.checkPassword)
                        }
                        if (!this.userForm.id) {
                            this.$api.httpPost(this.$url.AuthorityUser.addUser, obj).then(res => {
                                if (res.code === 0) {
                                    this.$notify({
                                        title: '提示',
                                        message: '添加用户成功',
                                        type: 'success'
                                    });
                                    this.cancel()
                                    this.pageList(this.page)
                                } else {
                                    this.$toolUtil.msg(res, this.error)
                                }
                            })
                        } else {
                            this.$api.httpPost(this.$url.AuthorityUser.editUser, obj).then(res => {
                                if (res.code === 0) {
                                    this.$notify({
                                        title: '提示',
                                        message: '编辑用户成功',
                                        type: 'success'
                                    });
                                    this.cancel()
                                    this.pageList(this.page)
                                } else {
                                    this.$toolUtil.msg(res, this.error)
                                }
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            // 清除表单校验信息
            closeDialog () {
                this.clearValidate('userForm');
                if (!this.addOrEdit) {
                    this.$toolUtil.clearForm(this.userForm)
                }
                this.cancel()
            },
            // 清除表单校验信息
            clearValidate (formName) {
                this.$refs[formName].clearValidate()
            },
            // 关闭弹框
            cancel () {
                this.$emit('cancel', false)
            },
        }
    }
</script>

<style lang="scss">

</style>