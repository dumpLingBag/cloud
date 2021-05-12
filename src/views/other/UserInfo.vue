<template>
    <div class="user-info vue-margin">
        <el-row>
            <el-col :span="8">
                <div class="radius" style="margin-right: 20px;">
                    <div class="user-title">个人信息</div>
                    <div class="vue-padding head-img">
                        <AvatarUser
                            :user="userInfo"
                        />
                    </div>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="radius">
                    <div class="user-title">基本资料</div>
                    <div class="vue-padding">
                        <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="80px">
                            <el-form-item label="用户昵称" prop="nickname" :error="error.nickname">
                                <el-input v-model="userInfo.nickname"></el-input>
                            </el-form-item>
                            <el-form-item label="用户邮箱" prop="email" :error="error.email">
                                <el-input v-model="userInfo.email"></el-input>
                            </el-form-item>
                            <el-form-item label="用户号码" prop="mobile" :error="error.mobile">
                                <el-input v-model="userInfo.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="用户性别">
                                <el-radio-group v-model="userInfo.sex">
                                    <el-radio label="0">男</el-radio>
                                    <el-radio label="1">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit('userInfo')">立即修改</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import config from '@/http/config'
import AvatarUser from "@/components/user/AvatarUser";

export default {
    name: 'UserInfo',
    components: {
        AvatarUser
    },
    data() {
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
            userInfo: {
                nickname: '',
                email: '',
                mobile: '',
                sex: ''
            },
            uploadUrl: config.baseUrl + 'authority/file/upload',
            headers: {'Authorization': this.$cookies.get('access_token')},
            error: {
                nickname: '',
                username: '',
                email: '',
                mobile: ''
            },
            rules: {
                nickname: [
                    {required: true, message: '请输入用户名称', trigger: 'blur'},
                    {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}
                ],
                username: [
                    {required: true, message: '请输入账号名称', trigger: 'blur'},
                    {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                ],
                mobile: [
                    {validator: mobile, required: true, trigger: 'blur'}
                ]
            }
        }
    },
    mounted() {
        this.imageUrl = this.userInfo.avatar
    },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.userInfo.avatar = this.imageUrl;
                    this.$api.request(this.$url.AuthorityUser.editUser, this.$method.put, this.userInfo).then(res => {
                        if (res.code === 0) {

                        } else {
                            this.$common.msg(res, this.error)
                        }
                    })
                } else {
                    return false
                }
            })
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 5;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 5MB!')
            }
            return isJPG && isLt2M
        }
    }
}
</script>

<style lang="scss">
    .user-info {
        color: #303133;
    }
    .user-info .user-title {
        font-size: 16px;
        padding: 10px 20px 5px;
        border-bottom: 1px solid #e6ebf5;
    }

    .user-info .vue-padding {
        padding: 20px;
    }

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
