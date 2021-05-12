<template>
    <el-dialog title="修改密码" :visible.sync="dialogPassword" width="40%" @close="closePwdDialog"
               :modal-append-to-body='false'>
        <el-form :model="passwordModel" :rules="rules" ref="passwordModel" label-width="100px"
                 :label-position="labelPosition" class="demo-ruleForm">
            <el-form-item label="旧的密码" prop="oldPassword">
                <el-input type="password" v-model="passwordModel.oldPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新的密码" prop="password">
                <el-input type="password" v-model="passwordModel.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPassword">
                <el-input type="password" v-model="passwordModel.checkPassword" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click="passwordDialog">取 消</el-button>
            <el-button size="medium" type="primary" @click="submitForm('passwordModel')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'Password',
    data() {
        let validateOldPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧的密码'))
            } else {
                this.$api.request(this.$url.User.checkPassword, this.$method.get, this.$qs.stringify({password: this.$md5(value)})).then(res => {
                    if (res.code !== 0) {
                        callback(new Error(res.msg))
                    }
                });
                callback()
            }
        };
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.passwordModel.checkPassword !== '') {
                    this.$refs.passwordModel.validateField('checkPassword')
                }
                callback()
            }
        };
        let validateCheckPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.passwordModel.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        };
        return {
            passwordModel: {
                oldPassword: '',
                password: '',
                checkPassword: ''
            },
            oldPassword: '',
            rules: {
                oldPassword: [
                    {validator: validateOldPass, trigger: 'blur'},
                    {min: 3, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'},
                    {required: true}
                ],
                password: [
                    {validator: validatePass, trigger: 'blur'},
                    {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'},
                    {required: true}
                ],
                checkPassword: [
                    {validator: validateCheckPass, trigger: 'blur'},
                    {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'},
                    {required: true}
                ]
            },
            labelPosition: 'right'
        }
    },
    props: {
        dialogPassword: Boolean
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let obj = {};
                    Object.keys(this.passwordModel).forEach(key => {
                        obj[key] = this.$md5(this.passwordModel[key])
                    });
                    this.$api.request(this.$url.User.updatePassword, this.$method.put, obj).then(res => {
                        if (res.code === 0) {
                            this.passwordDialog();
                            this.$alert('密码修改成功，请重新登录', '提示', {
                                confirmButtonText: '确定',
                                showClose: false,
                                callback: () => {
                                    this.$store.dispatch('loginOut');
                                    this.$router.push('/login')
                                }
                            })
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                }
            })
        },
        passwordDialog() {
            this.$emit('closePasswordDialog', false)
        },
        closePwdDialog() {
            this.$emit('closePasswordDialog', false)
        }
    }
}
</script>

<style scoped>

</style>
