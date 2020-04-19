<template>
    <div class="message">
        <v-search-message :message="message" :tabIndex="tabIndex" v-on:dialogMessage="dialogMessage"></v-search-message>
        <v-release-message :messageVisible="messageVisible" v-on:closeDialog="closeDialog"></v-release-message>
        <div class="vue-padding radius">
            <el-tabs :tab-position="tabPosition" @tab-click="tabClick($event.index)">
                <el-tab-pane :label="'未读消息('+ haveReadList.length +')'">

                </el-tab-pane>
                <el-tab-pane :label="'已读消息('+ unreadList.length +')'">

                </el-tab-pane>
                <el-tab-pane :label="'回收站('+ recycleBinList.length +')'">

                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import vSearchMessage from '@/components/other/SearchMessage'
    import vReleaseMessage from '@/components/other/ReleaseMessage'
    export default {
        name: 'Message',
        components: {
            vSearchMessage,
            vReleaseMessage
        },
        data() {
            return {
                tabPosition: 'top',
                isHeight: false,
                maxHeight: window.innerHeight - 369,
                haveReadList: [],
                unreadList: [],
                recycleBinList: [],
                system: true,
                tabIndex: '',
                messageVisible: false,
                message: {

                }
            }
        },
        mounted() {
            let clientHeight = document.getElementsByClassName('el-tabs__content')[0].clientHeight
            if (clientHeight > window.innerHeight - 369) {
                this.isHeight = !this.isHeight
            }
            this.tabClick(0)
        },
        methods: {
            haveRead() { // 标为已读
                alert('111')
            },

            unread() { // 删除
                alert('222')
            },

            recycleBin() { // 还原
                alert('333')
            },

            haveReadAll(data) { // 标记全部
                console.log(data)
            },

            unreadAll(data) { // 删除全部

            },

            deleteAll(data) { // 清空回收站

            },

            tabClick(data) {
                this.tabIndex = String(data);
                this.$api.request(this.$url.Message.load + '/' + data).then(res => {
                    if (res.code === 0) {
                        this.messageList(data, res.data)
                    }
                })
            },

            messageList(index, data) {
                if (data && data.length > 0) {
                    switch (index) {
                        case 0:
                            this.haveReadList = data
                            break
                        case 1:
                            this.unreadList = data
                            break
                        case 2:
                            this.recycleBinList = data
                            break
                        default:
                    }
                }
            },

            dialogMessage(data) {
                this.messageVisible = data
            },

            closeDialog(data) {
                this.messageVisible = data
            }
        }
    }
</script>

<style lang="scss">
    .message .el-collapse-item__header {
        font-weight: 500;
    }

    .message-title {
        font-size: 15px;
    }

    .hot {
        color: red;
    }

    .message-time {
        position: absolute;
        right: 50px;
        font-weight: normal;

        button {
            margin-left: 50px;
        }
    }

    .message-handle {
        margin-top: 20px;
    }

    .message .el-tabs__header {
        margin-bottom: 0;
    }
</style>
