<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
    <div class="icon vue-padding radius">
        <div class="tips">阿里图标库</div>
        <vue-scroll>
            <div class="icon-list" :style="{height: height + 'px'}">
                <ul class="icon-ul">
                    <li v-for="item in icon" :key="item.id" v-clipboard:copy="item.icon" v-clipboard:success="onCopy"
                        v-clipboard:error="onError">
                        <span class="icon">
                            <i :class="item.icon"></i>
                            <span class="icon-name">{{item.text}}</span>
                        </span>
                    </li>
                </ul>
            </div>
            <el-backtop></el-backtop>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: 'Icon',
        data() {
            return {
                icon: [],
                height: 0
            }
        },
        mounted() {
            this.height = document.documentElement.clientHeight - 278;
            this.getIconList()
        },
        computed: {

        },
        methods: {
            onCopy(e) {
                this.$message.success(e.text + '成功复制到剪切板')
            },
            onError(e) {
                this.$message.error('复制' + e.text + '到剪切板失败')
            },
            getIconList() {
                this.$api.request(this.$url.IconList.loadIcon, this.$method.get).then(res => {
                    if (res.code === 0) {
                        this.icon = res.data
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .icon {
        .icon-list::before {
            content: none;
        }
        .icon-ul {
            overflow: hidden;
            border: 1px solid #eaeefb;
            border-radius: 4px;

            li {
                float: left;
                width: 10%;
                text-align: center;
                height: 120px;
                line-height: 120px;
                color: #666;
                font-size: 13px;
                transition: color .15s linear;
                border-right: 1px solid #eee;
                border-bottom: 1px solid #eee;
                margin-right: -1px;
                margin-bottom: -1px;
                cursor: pointer;

                .icon {
                    display: inline-block;
                    line-height: normal;
                    vertical-align: middle;
                    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
                    color: #99a9bf;

                    i {
                        display: block;
                        font-size: 32px;
                        margin-bottom: 15px;
                        color: #606266;
                        transition: all 0.6s;
                    }
                }

                .icon-name {
                    display: inline-block;
                    padding: 0 3px;
                    height: 1em;
                    color: #606266;
                }
            }

            li:hover {
                i {
                    transform: scale(1.4);
                }
            }
        }
    }
</style>
