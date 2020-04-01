<template>
    <div class="login" style="width: 100%;height: 100%;">
        <div class="content">
            <el-form :label-position="labelPosition" class="login-container" :rules="rules" ref="login"
                     label-width="80px" :model="login">
                <div class="login-top">饺子包后台管理系统</div>
                <el-form-item prop="account">
                    <el-input v-model="login.account" placeholder="用户名/邮箱" @keyup.enter.native="enterSubmit('login')"
                              prefix-icon="el-icon-mobile-phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="login.password" type="password" @keyup.enter.native="enterSubmit('login')"
                              placeholder="输入登录密码" auto-complete="off" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item prop="code" v-if="failNum > 2">
                    <el-input v-model="login.code" style="width: calc(100% - 142px)" prefix-icon="iconfont icon-anquan"
                              placeholder="验证码"></el-input>
                    <div class="login-code" @click="getLoginCode()"
                         style="border: 1px solid #DCDFE6;width: 130px;height: 2.68rem;float: right;border-radius: 4px;overflow: hidden;">
                        <img :src="codeImage">
                    </div>
                </el-form-item>
                <el-checkbox v-model="login.checked">记住我</el-checkbox>
                <el-button type="primary" style="width: 100%;margin-top: 30px" @click="submitForm('login')"
                           :loading="loading">
                    {{loading ? '登录中' : '登录'}}
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
    const md5 = require('js-md5');
    export default {
        name: 'Login',
        data() {
            return {
                labelPosition: 'top',
                loading: false,
                login: {
                    account: '',
                    password: '',
                    code: '',
                    checked: false,
                    codeKey: ''
                },
                codeImage: '',
                passVal: '',
                failNum: 0,
                rules: {
                    account: [
                        {required: true, message: '请输入用户名或手机号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'change'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            let that = this;
            this.$cookies.remove('access_token');
            window.onkeydown = function (event) {
                if (event.key && event.key === 'Enter') {
                    that.submitForm('login')
                }
            }
        },
        methods: {
            submitForm(formName) {
                const that = this;
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.loading = !that.loading;
                        const obj = {account: that.login.account, password: md5(that.login.password)};
                        obj.code = that.login.code;
                        obj.codeKey = that.login.codeKey;
                        obj.checked = that.login.checked;
                        that.$api.request(that.$url.Login.login, that.$method.post, that.$qs.stringify(obj)).then(res => {
                            if (res.code === 0) {
                                if (res.data !== '') {
                                    let userInfo = res.data.userInfo;
                                    userInfo.checked = that.login.checked;
                                    userInfo.access_token = res.data.access_token;
                                    that.$store.dispatch('login', userInfo).then(() => {
                                        that.$router.push('/main')
                                    });
                                }
                            } else {
                                that.failNum++;
                                if (that.failNum > 2) {
                                    that.getLoginCode()
                                }
                                that.loading = !that.loading
                            }
                        }).catch(() => {
                            that.loading = !that.loading
                        })
                    } else {
                        return false
                    }
                })
            },
            enterSubmit(formName) {
                this.submitForm(formName)
            },
            getLoginCode() {
                this.$api.request(this.$url.Login.captcha, this.$method.get).then(res => {
                    if (res.code === 0) {
                        this.codeImage = res.data.code;
                        this.login.codeKey = res.data.key
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .login {
        height: 100%;

        .content {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            background-image: url("../assets/img/login.png");
            background-size: cover;

            .login-container {
                top: 50%;
                right: 8%;
                margin-left: -175px;
                margin-top: -201px;
                position: absolute;
                width: 350px;
                border-radius: 10px;
                padding: 25px 30px 30px 30px;
                background-color: #fff;
                box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);

                .login-top {
                    font-size: 20px;
                    box-sizing: border-box;
                    color: #707070;
                    margin-bottom: 30px;
                    text-align: center;
                    letter-spacing: 5px;
                }
            }
        }

        .el-input__icon {
            margin-left: 5px;
            font-size: 1.2rem !important;
        }

        .el-input__inner {
            padding-left: 40px;
            height: 2.8rem;
            line-height: 2.8rem;
            font-size: 14px;
        }

        .el-input__icon {
            line-height: 2.8rem;
        }

        .login-code {
            cursor: pointer;
        }
    }
</style>
