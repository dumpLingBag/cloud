<template>
    <div class="release-message">
        <el-dialog title="提示" :visible.sync="messageVisible" width="50%" :before-close="handleClose">
            <tinymce-editor v-model="msg"
                            :disabled="disabled"
                            @onClick="onClick"
                            ref="editor">
            </tinymce-editor>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="sendMessage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import TinymceEditor from '@/components/tinymce/Tinymce'
    export default {
        name: "ReleaseMessage",
        components: {
            TinymceEditor
        },
        props: {
            messageVisible: Boolean
        },
        data() {
            return {
                disabled: false,
                msg: ''
            }
        },
        methods: {
            handleClose() {
                this.closeDialog()
            },

            sendMessage() {
                this.closeDialog()
            },

            closeDialog() {
                this.$emit('closeDialog', false)
            },

            onClick(e, editor) {

            }
        }
    }
</script>

<style scoped>

</style>