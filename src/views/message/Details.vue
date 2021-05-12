<template>
    <div class="details">
        <Search
            :search="search"
            :modelData="modelData"
            @saveChange="saveChange"
        />
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
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="editMessage(scope.row)">编辑</el-button>
                        <el-button type="text"  size="mini" @click="delMessage(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import Search from '@/components/search/Index'
export default {
    name: "Details",
    components: {
        Search
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
                btnSearch: [
                    {
                        btnType: this.$btnType.SAVE,
                        hasPerm: ['sys:dict:add'],
                        name: '发布消息'
                    }
                ]
            },
            modelData: {}
        }
    },
    methods: {
        handleSelectionChange() {

        },
        editMessage() {

        },
        delMessage() {

        },
        saveChange() {
            this.$router.push('/message/release')
        }
    }
}
</script>

<style scoped>

</style>
