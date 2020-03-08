<template>
    <div class="avatar-user">
        <img :src="options.img" class="img-circle" @click="editAvatar()" @error="errorAvatar" title="点击更换头像">
        <el-dialog :title="title" :modal-append-to-body='true' :append-to-body="true" :visible.sync="open" width="800px">
            <el-row>
                <el-col :xs="24" :md="12" :style="{height: '350px'}">
                    <vue-cropper
                            ref="cropper"
                            :img="options.img"
                            :info="true"
                            :full="options.full"
                            :autoCrop="options.autoCrop"
                            :autoCropWidth="options.autoCropWidth"
                            :autoCropHeight="options.autoCropHeight"
                            :fixedBox="options.fixedBox"
                            @realTime="realTime"
                    />
                </el-col>
                <el-col :xs="24" :md="12" :style="{height: '350px'}">
                    <div class="avatar-upload-preview">
                        <img :src="previews.url" :style="previews.img" />
                    </div>
                </el-col>
            </el-row>
            <br>
            <el-row>
                <el-col :lg="2" :md="2">
                    <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
                        <el-button size="small">
                            上传
                            <i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :lg="{span: 1, offset: 2}" :md="2">
                    <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
                </el-col>
                <el-col :lg="{span: 1, offset: 1}" :md="2">
                    <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
                </el-col>
                <el-col :lg="{span: 1, offset: 1}" :md="2">
                    <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
                </el-col>
                <el-col :lg="{span: 1, offset: 1}" :md="2">
                    <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
                </el-col>
                <el-col :lg="{span: 2, offset: 6}" :md="2">
                    <el-button type="primary" size="small" @click="uploadImg()">提 交</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
    name: "avatarUser",
    components: {
        VueCropper
    },
    props: {
        userInfo: Object
    },
    data() {
        return {
            title: '修改头像',
            open: false,
            options: {
                img: '', //裁剪图片的地址
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 200, // 默认生成截图框宽度
                autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                full: true,
            },
            previews: {},
            fileName: ''
        }
    },
    methods: {
        editAvatar() {
            this.open = true
        },
        // 覆盖默认的上传行为
        requestUpload() {
        },
        // 向左旋转
        rotateLeft() {
            this.$refs.cropper.rotateLeft();
        },
        // 向右旋转
        rotateRight() {
            this.$refs.cropper.rotateRight();
        },
        // 图片缩放
        changeScale(num) {
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        // 上传预处理
        beforeUpload(file) {
            if (file.type.indexOf("image/") === -1) {
                this.$message.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.fileName = file.name;
                    this.options.img = reader.result;
                };
            }
        },
        // 上传图片
        uploadImg() {
            this.$refs.cropper.getCropBlob(data => {
                let formData = new FormData();
                formData.append('file', data);
                formData.append('fileName', this.fileName);
                this.$api.request(this.$url.User.uploadAvatar, this.$method.post, formData).then(res => {
                    if (res.code === 0) {
                        this.open = false;
                        this.options.img = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                    this.$refs.cropper.clearCrop();
                })
            });
        },
        // 实时预览
        realTime(data) {
            this.previews = data;
        },
        errorAvatar(e) {
            e.target.src = 'https://oss.rngay.cn/images/2020/03/08/AEFC37D6F2DB7FB7ECB5C10ABAC6949D.jpeg'
        }
    }
}
</script>

<style lang="scss">
    .avatar-user {
        .img-circle {
            width: 120px;
            height: 120px;
            display: block;
            margin: 0 auto;
            border-radius: 50%;
        }
        .img-circle:hover {
            cursor: pointer;
        }
    }
    .avatar-upload-preview {
        position: absolute;
        top: 50%;
        transform: translate(50%,-50%);
        width: 180px;
        height: 180px;
        border-radius: 50%;
        box-shadow: 0 0 4px #ccc;
        overflow: hidden;
    }
</style>