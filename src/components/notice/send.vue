<template>
    <div>
        <el-dialog title="发送消息" :visible.sync="noticeDialogFlag" width="40%"
                   @close="sendClose" :modal-append-to-body='false'>
            <el-form ref="form" :model="message" label-width="auto">
                <el-form-item prop="text"
                              :rules="[{ required: true, message: '消息内容不能为空', trigger: 'blur' }]">
                    <el-input type="textarea" rows="3" :rows="5" placeholder="请输入消息内容" v-model="message.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="notice">取 消</el-button>
        <el-button size="medium" type="primary" @click="subNotice">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'send',
    type: 'TEXT',
    data() {
        return {
            message: {
                content: ''
            }
        }
    },
    props: {
        noticeDialogFlag: Boolean,
        userId: String
    },
    methods: {
        notice() {
            this.$emit('noticeDialog', false)
        },
        subNotice() {
            const time = this.$common.time(new Date());
            const userId = JSON.parse(localStorage.getItem('user')).id;
            let fmTo = this.userId > userId ? userId + this.userId : this.userId + userId;
            const obj = {
                fromUserId: userId,
                toUserId: this.userId,
                userInfoId: fmTo,
                content: this.message.content,
                createTime: time,
                smsType: 0,
                smsStatus: 0
            };
            this.$emit('noticeContent', JSON.stringify(obj));
            this.notice()
        },
        sendClose() {
            this.notice()
        }
    }
}
</script>

<style lang="scss">

</style>
