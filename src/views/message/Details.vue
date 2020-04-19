<template>
    <div class="details">
        <v-search-message :message="message"></v-search-message>
        <div class="vue-padding radius">
            <el-table v-loading="loading" element-loading-text="拼命加载中" :data="messageList" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed width="55"></el-table-column>
                <el-table-column prop="title" label="消息标题"></el-table-column>
                <el-table-column prop="type" label="消息类型"></el-table-column>
                <el-table-column prop="popup" label="是否弹窗"></el-table-column>
                <el-table-column prop="releaseTime" label="发布时间"></el-table-column>
                <el-table-column prop="username" label="创建者"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="remarks" label="备注"></el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="editMessage(scope.row)">编辑</el-button>
                        <el-button type="danger"  size="mini" @click="delMessage(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import vSearchMessage from '@/components/message/SearchMessage'
    export default {
        name: "Details",
        components: {
            vSearchMessage
        },
        data() {
            return {
                loading: false,
                messageList: [],
                message: {
                    title: '',
                    status: '',
                    startTime: '',
                    endTime: ''
                }
            }
        },
        methods: {
            handleSelectionChange() {

            },
            editMessage() {

            },
            delMessage() {

            }
        }
    }
</script>

<style scoped>

</style>