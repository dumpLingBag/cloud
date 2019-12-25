<template>
  <div class="login" style="width: 100%;height: 100%;">
    <div class="content">
      <el-form :label-position="labelPosition" class="login-container" :rules="rules" ref="login" label-width="80px"
               :model="login">
        <div class="login-top">饺子包</div>
        <el-form-item prop="account">
          <el-input v-model="login.account" placeholder="用户名/手机号" @keyup.enter.native="enterSubmit('login')"
                    prefix-icon="el-icon-mobile-phone"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="login.password" type="password" @keyup.enter.native="enterSubmit('login')"
                    placeholder="输入登录密码" show-password prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-button type="primary" style="width: 100%;margin-top: 30px" @click="submitForm('login')" :loading="loading">
          {{loading ? '登录中' : '提交'}}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
const md5 = require('js-md5')
export default {
  name: 'Login',
  data () {
    return {
      labelPosition: 'top',
      loading: false,
      login: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入用户名或手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    let that = this;
    window.onkeydown = function (event) {
      if (event.keyCode === 13) {
        that.submitForm('login')
      }
    }
  },
  methods: {
    submitForm (formName) {
      const _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = !this.loading;
          const obj = { account: this.login.account };
          obj.password = md5(this.login.password);
          this.$api.httpPost(this.$url.Login.login, this.$qs.stringify(obj)).then(res => {
            console.log('登录', res)
            if (res.code === 0) {
              if (res.data !== '') {
                localStorage.token = res.data.token;
                _this.$store.dispatch('login', res.data.userResult);
                this.$router.push('/main')
              }
            } else {
              this.loading = !this.loading
            }
          }).catch(() => {
              this.loading = !this.loading
          })
        } else {
          return false
        }
      })
    },
    enterSubmit (formName) {
      this.submitForm(formName)
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
        margin-top: -185px;
        position: absolute;
        width: 350px;
        border-radius: 10px;
        padding: 50px 30px 50px 30px;
        background-color: #fff;
        box-shadow: 0 0 20px 2px rgba(0, 0, 0, .1);
        .login-top {
          font-size: 24px;
          box-sizing: border-box;
          color: #333;
          margin-bottom: 50px;
          font-weight: 600;
        }
      }
    }
    .el-input__icon {
      margin-left: 5px;
      font-size: 1.3rem!important;
    }
    .el-input__inner {
      padding-left: 40px;
      height: 2.8rem;
      line-height: 2.8rem;
    }
    .el-input__icon {
      line-height: 2.8rem;
    }
  }
</style>
