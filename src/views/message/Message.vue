<template>
    <div class="message">
        <Search
            :search="search"
            :modelData="modelData"
            @saveChange="saveChange"
        />
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
import Search from '@/components/search/Index'
export default {
    name: 'Message',
    components: {
        Search
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

            },
            search: {
                typeSearch: [
                    {
                        label: '消息标题',
                        name: 'title'
                    },
                    {
                        label: '发布时间',
                        type: 'date'
                    },
                    {
                        label: '消息状态',
                        name: 'businessType',
                        dictType: 'sys_yes_no',
                        type: 'select'
                    }
                ],
                btnSearch: []
            },
            modelData: {},
            btnType: {
                '0': {
                    btnType: {
                        type: 'warning',
                        icon: 'el-icon-folder-checked',
                        event: ''
                    },
                    hasPerm: ['sys:message:'],
                    name: '标为已读'
                },
                '1': {
                    btnType: {
                        type: 'danger',
                        icon: 'el-icon-delete',
                        event: ''
                    },
                    hasPerm: ['sys:message:'],
                    name: '删除全部'
                },
                '2': {
                    btnType: {
                        type: 'danger',
                        icon: 'el-icon-delete',
                        event: ''
                    },
                    hasPerm: ['sys:message:'],
                    name: '清空回收站'
                }
            }
        }
    },
    watch: {
        tabIndex: function (newVal) {
            this.search.btnSearch.splice(0, 1)
            this.search.btnSearch.push(this.btnType[newVal])
        }
    },
    mounted() {
        let clientHeight = document.getElementsByClassName('el-tabs__content')[0].clientHeight
        if (clientHeight > window.innerHeight - 369) {
            this.isHeight = !this.isHeight
        }
        this.tabClick(0);
        this.search.btnSearch.push(this.btnType['0'])
    },
    methods: {
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
        },

        saveChange() {

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
