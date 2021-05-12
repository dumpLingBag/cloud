<template>
    <div class="release vue-padding radius">
        <div class="item title">
            <el-input v-model="message.title" placeholder="请输入消息标题" show-word-limit maxlength="100"></el-input>
        </div>
        <div class="item">
            <tinymce v-on:input="input" :value="message.content"></tinymce>
        </div>
        <el-row :gutter="20" class="item">
            <el-col :span="6">
                <span class="item__label">消息类型：</span>
                <el-select v-model="message.msgType" placeholder="请选择消息类型">
                    <el-option v-for="item in messageType" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <span class="item__label">是否弹窗：</span>
                <el-select v-model="message.popup" placeholder="请选择是否弹窗">
                    <el-option v-for="item in yesNo" :key="item.id" :label="item.dictLabel" :value="item.dictValue"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <span class="item__label">发布时间：</span>
                <el-date-picker
                        v-model="message.releaseTime"
                        type="datetime"
                        placeholder="选择发布时间"
                        default-time="12:00:00">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row class="item">
            <el-button type="text" size="small" @click="release">发布消息</el-button>
            <el-button type="success" size="small" @click="draft">保存草稿</el-button>
            <el-button type="danger" size="small" @click="cancel">取消</el-button>
        </el-row>
    </div>
</template>

<script>
import tinymce from '@/components/tinymce/Tinymce'
export default {
    name: "Release",
    components: {
        tinymce
    },
    data() {
        return {
            count: 0,
            message: {
                title: '',
                content: '',
                msgType: '',
                popup: '',
                releaseTime: ''
            },
            title: '',
            messageType: [],
            yesNo: [],
            rules: {
                title: [
                    {message: '请输入消息标题'}
                ],
                popup: [
                    {message: '请选择是否弹窗提醒'}
                ],
                msgType: [
                    {message: '请选择消息类型'}
                ],
                content: [
                    {message: '请输入消息内容'}
                ],
                releaseTime: [
                    {message: '请选择发布时间'}
                ]
            }
        }
    },
    mounted() {
        this.getMessageType();
        this.getYesNo()
    },
    methods: {
        getMessageType() {
            this.$api.dict('sys_notice_type').then(res => {
                if (res.code === 0) {
                    this.messageType = res.data
                }
            })
        },
        getYesNo() {
            this.$api.dict('sys_yes_no').then(res => {
                if (res.code === 0) {
                    this.yesNo = res.data
                }
            })
        },
        input(content) {
            this.message.content = content
        },
        cancel() {
            this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
                const item = views.slice(-1)[0];
                if (item) {
                    this.$router.push(item.path)
                } else {
                    this.$router.push('/main')
                }
            })
        },
        draft() {
            this.validate()
        },
        release() {
            this.validate()
        },
        validate() {
            for (let key in this.message) {
                if (!this.message.hasOwnProperty(key)) continue;
                if (this.message[key] === '') {
                    this.$message.warning(this.rules[key][0].message);
                    return false;
                }
            }
        }
    }
}
</script>

<style lang="scss">
    .release {
        .title {
            position: relative;
        }
        .title .el-input .el-input__inner {
            border: none;
            background-color: #efefef!important;
        }
        .item {
            margin-bottom: 20px;
        }
        .item:last-child {
            margin-bottom: 0;
        }
        .el-input__count-inner {
            font-size: 16px;
            background: transparent!important;
        }
        .item__label {
            color: #606266;
            margin-right: 10px;
        }
    }
</style>
