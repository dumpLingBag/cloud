<template>
    <div class="notice vue-padding radius">
        <div class="tips">{{$route.name}}</div>
        <div class="notice-main">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="userList" :height="maxHeight">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
                <el-table-column prop="account" label="账号" width="100"></el-table-column>
                <el-table-column prop="name" label="名称" width="120"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="号码"></el-table-column>
                <el-table-column label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag size="medium" :type="Number(scope.row.enable) === 1 ? 'success' : 'warning'">
                            {{ Number(scope.row.enable) === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="注册时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column prop="expireTime" label="加入时间">
                    <template slot-scope="scope">
                        {{scope.row.expireTime}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="sendNotice(scope.row)">发消息</el-button>
                        <el-button type="warning" size="mini" @click="banned(scope.row)">禁言</el-button>
                        <el-button type="danger" size="mini" :disabled="scope.row.account === 'admin'"
                                   @click="kickOut(scope.row)">踢出聊天
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" @current-change="noticePage"
                           :current-page="page.currentPage" :total="page.totalSize"
                           :page-size="page.pageSize"></el-pagination>
        </div>
        <send-notice :noticeDialogFlag="noticeDialogFlag" :userId="userId" v-on:noticeDialog="noticeDialog"
                     v-on:noticeContent="noticeContent"></send-notice>
    </div>
</template>

<script>
    import sendNotice from '@/components/notice/send'

    export default {
        name: 'Notice',
        data() {
            return {
                webSocket: null,
                maxHeight: this.$common.maxNotHeight,
                userList: [],
                loading: false,
                noticeDialogFlag: false,
                userId: '',
                count: 0,
                lockReconnect: false, // 是否真正建立连接
                timeout: 60 * 1000, // 60秒一次心跳
                timeoutObj: null, // 心跳心跳倒计时
                serverTimeoutObj: null, // 心跳倒计时
                timeoutNum: null, // 断开 重连倒计时
                page: {// 初始分页数据
                    pageSize: 10,
                    currentPage: 1
                }
            }
        },
        components: {
            sendNotice
        },
        mounted() {
            this.createWebSocket()
        },
        beforeDestroy() {
            this.onbeforeunload()
        },
        methods: {
            createWebSocket() {
                if ('WebSocket' in window) {
                    const userId = JSON.parse(localStorage.getItem('user')).id
                    let socketUrl = process.env.NODE_ENV === 'production' ? 'wss://cloud.rngay.cn' : 'ws://127.0.0.1:9099'
                    this.webSocket = new WebSocket(socketUrl + '/notice/socket?userId=' + userId)
                    this.initWebSocket()
                } else {
                    this.$message.error('当前浏览器不支持 WebSocket 连接')
                }
            },
            reconnect() { // 重新连接
                let that = this
                if (this.lockReconnect) {
                    return false
                }
                that.lockReconnect = true
                that.timeoutNum && clearTimeout(that.timeoutNum)
                that.timeoutNum = setTimeout(() => {
                    that.createWebSocket()
                    that.lockReconnect = false
                }, 5000)
            },
            reset() { // 重置心跳
                clearTimeout(this.timeoutObj)
                this.start()
            },
            start() { // 开启心跳
                let self = this
                self.timeoutObj && clearTimeout(self.timeoutObj)
                self.timeoutObj = setTimeout(() => {
                    if (self.webSocket.readyState === 1) {
                        const time = this.$time.time(new Date())
                        const obj = {send: 0, receive: 0, sendReceive: 0, content: 'ping', createTime: time, smsType: 0}
                        self.webSocket.send(JSON.stringify(obj))
                    } else {
                        self.reconnect()
                    }
                }, 60000)
            },
            initWebSocket() {
                // 连接错误
                this.webSocket.onerror = this.setErrorMessage

                // 连接成功
                this.webSocket.onopen = this.setOnOpenMessage

                // 收到消息的回调
                this.webSocket.onmessage = this.setOnMessageMessage

                // 连接关闭的回调
                this.webSocket.onclose = this.setOnCloseMessage

                // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                window.onbeforeunload = this.onBeforeUnload
            },
            getUser() {
                this.loading = !this.loading
                this.$api.httpPost(this.$url.Notice.getUser, this.page).then(res => {
                    if (res.code === 0) {
                        this.userList = res.data.list
                        this.page.totalSize = res.data.totalSize
                        this.loading = !this.loading
                    }
                }).catch(() => {
                    this.loading = !this.loading
                })
            },
            setErrorMessage() {
                this.$message.error('WebSocket连接发生错误')
                this.reconnect()
            },
            setOnOpenMessage() {
                this.getUser()
                this.start()
            },
            setOnMessageMessage(event) {
                let message = JSON.parse(event.data)
                if (message) {
                    if (parseInt(message.sendReceive) !== 0) {
                        this.$notify.success({
                            title: '收到一条新消息',
                            message: message.content,
                            duration: 0
                        })
                    } else {
                        this.reset()
                    }
                }
            },
            setOnCloseMessage() {
                // socket 连接关闭
                // this.$message({ type: 'warning', message: 'WebSocket连接关闭' })
            },
            onBeforeUnload() {
                this.closeWebSocket()
            },
            // websocket发送消息
            sendWebSocket(text) {
                this.webSocket.send(text)
            },
            closeWebSocket() {
                this.webSocket.close()
            },
            noticePage(currentPage) {
            },
            sendNotice(row) {
                this.noticeDialogFlag = !this.noticeDialogFlag
                this.userId = String(row.id)
            },
            noticeContent(data) {
                this.sendWebSocket(data)
            },
            kickOut(row) { // 踢出聊天室
                this.$api.httpGet(this.$url.Notice.kickOut + '?userId=' + row.id).then(res => {
                    if (res.code === 0) {
                        this.getUser()
                    }
                })
            },
            noticeDialog(data) {
                this.noticeDialogFlag = data
                this.userId = ''
            },
            banned(row) { // 禁言
                this.$prompt('请输入禁言时间', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: (val) => {
                        if (val) {
                            if (!new RegExp('([1-9])|(([1-6][0])|([1-5][0-9]))\\d{1,2}').test(val)) {
                                return '禁言时间为1~60分钟'
                            }
                        } else {
                            return '请输入禁用时间'
                        }
                    }
                }).then(({value}) => {
                    this.$api.httpPost(this.$url.Notice.banned, this.$qs.stringify({
                        userId: row.id,
                        expire: value
                    })).then(res => {
                        if (res.code === 0) {
                            this.$message.success('禁言用户成功!')
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消输入')
                })
            }
        }
    }
</script>

<style lang="scss">
    .notice {
        .notice-main {
            overflow: hidden;
        }

        .el-pagination {
            margin-top: 30px;
            float: right;
        }

        .message-window {
            position: fixed;
            background-color: #ffffff;
            padding: 10px;
            border-radius: 2px;
            right: 0;
            top: 105px;
            border: 1px solid #D9D9D9;
            box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
        }

        .message-window:hover {
            cursor: pointer;
        }
    }
</style>
