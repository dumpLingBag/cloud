<template>
  <div class="user-info vue-padding radius">
    <div class="tips">{{$route.name}}</div>
    <div style="width: 50%">
      <el-form ref="form" :model="userInfo" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="账号名称">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="用户号码">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload class="avatar-uploader"
                     :action="uploadUrl"
                     :auto-upload="true"
                     :headers="headers"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
    return {
      userInfo: {},
      imageUrl: '',
      uploadUrl: config.baseUrl + 'file/upload',
      headers: { 'token': localStorage.token }
    }
  },
  methods: {
    onSubmit () {
      this.userInfo.avatar = this.imageUrl
      console.log(this.imageUrl)
      this.$api.httpPost(this.$url.AuthorityUser.editUser, this.userInfo).then(res => {
        if (res.code === 0) {
          console.log(res)
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
