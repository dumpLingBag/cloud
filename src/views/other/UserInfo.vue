<template>
  <div class="user-info vue-padding radius">
    <div class="tips">{{$route.name}}</div>
    <div style="width: 50%">
      <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="80px">
        <el-form-item label="用户名称" prop="nickname" :error="error.nickname">
          <el-input v-model="userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="账号名称" prop="username" :error="error.username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email" :error="error.email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="用户号码" prop="mobile" :error="error.mobile">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload class="avatar-uploader" :action="uploadUrl" :auto-upload="true"
                     :headers="headers" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('userInfo')">立即修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import config from '@/http/config'
export default {
  name: 'UserInfo',
  data () {
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
      userInfo: {},
      imageUrl: '',
      uploadUrl: config.baseUrl + 'file/upload',
      headers: { 'token': localStorage.token },
      error: {
        nickname: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { validator: mobile, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.userInfo.avatar = this.imageUrl
          this.$api.httpPost(this.$url.AuthorityUser.editUser, this.userInfo).then(res => {
            if (res.code === 0) {
              let user = JSON.parse(window.localStorage.getItem('user'))
              Object.keys(this.userInfo).forEach(key => {
                if (this.userInfo[key]) {
                  user[key] = this.userInfo[key]
                }
              })
              window.localStorage.setItem('user', JSON.stringify(user))
            } else {
              this.$toolUtil.msg(res, this.error)
            }
          })
        } else {
          return false
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    }
  },
  mounted () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user'))
    this.imageUrl = this.userInfo.avatar
  }
}
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
