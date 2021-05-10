<template>
    <div class="import">
        <el-dialog
                title="批量导入"
                :visible.sync="importDialog"
                width="30%"
                :before-close="handleClose">
            <el-upload
                    class="upload"
                    drag
                    limit="1"
                    accept=".xls,.xlsx"
                    ref="uploadUser"
                    :action="uploadUrl"
                    :headers="header"
                    :before-upload="beforeUpload"
                    :on-exceed="exceed"
                    :auto-upload="false"
                    :multiple="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传 xls 或者 xlsx 文件，且不超过2M</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="closeImportDialog">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitUpload">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "importIndex",
        props: {
            importDialog: Boolean
        },
        data() {
            return {
                header: '',
                uploadUrl: ''
            }
        },
        methods: {
            handleClose() {

            },

            beforeUpload() {

            },

            exceed() {

            },

            closeImportDialog() {

            },

            submitUpload() {

            }
        }
    }
</script>

<style scoped>

</style>
