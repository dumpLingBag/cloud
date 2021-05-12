<template>
    <div class="import-user">
        <el-dialog
                title="用户导入"
                :visible.sync="importDialog"
                width="30%"
                :before-close="handleClose">
            <el-upload
                    class="upload-demo"
                    drag
                    limit="1"
                    accept=".xls,.xlsx"
                    ref="uploadUser"
                    :action="uploadUrl"
                    :headers="header"
                    :before-upload="beforeUploadUser"
                    :on-exceed="exceedUser"
                    :auto-upload="false"
                    :multiple="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传 xls 或者 xlsx 文件，且不超过2M</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="closeImportUserDialog">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitUploadUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import config from "@/http/config";
export default {
    name: "importUser",
    props: {
        importDialog: Boolean
    },
    data() {
        return {
            uploadUrl: config.baseUrl + this.$url.AuthorityUser.importUser,
            header: {
                'Authorization': this.$cookies.get('access_token')
            }
        }
    },
    methods: {
        handleClose() {
            this.$refs.uploadUser.clearFiles();
            this.closeImportUserDialog()
        },
        beforeUploadUser(file) {
            const type = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const size = file.size / 1024 / 1024 < 2;
            if (!type) {
                this.$message.warning('上传文件类型只能是 xls 或者 xlsx')
            }
            if (!size) {
                this.$message.warning('上传文件大小不能超过2M')
            }
            return type && size;
        },
        exceedUser() {
            this.$message.warning('上传文件超出限制')
        },
        submitUploadUser() {
            this.$refs.uploadUser.submit();
        },
        closeImportUserDialog() {
            this.$emit('closeImportUserDialog', false)
        }
    }
}
</script>

<style lang="scss">
    .import-user {
        .el-upload {
            width: 100%;
        }
        .el-upload-dragger {
            width: 100%;
        }
    }
</style>
