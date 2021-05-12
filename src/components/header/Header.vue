<template>
    <div class="sys-header">
        <el-header class="el-header-nav radius" :style="collapse ? 'left: 80px' : 'left: 260px'">
            <ul class="el-ul el-ul-left ul-icon" style="float: left">
                <li @click="isHeader()" :title='collapse ? "打开侧栏" : "关闭侧栏"'>
                    <a href="javascript:;">
                        <i :class="collapse ? 'el-icon-lock' : 'el-icon-unlock'"></i>
                    </a>
                </li>
                <li @click="isTags()" title="显示tags">
                    <a href="javascript:;">
                        <i class="el-icon-mouse"></i>
                    </a>
                </li>
            </ul>
            <ul class="el-ul el-ul-right ul-icon" style="float: right">
                <li @click="notice()">
                    <a href="javascript:;" title="消息"><i class="el-icon-bell"></i></a>
                </li>
                <li @click="screen()" title="全屏"><a href="javascript:;"><i class="el-icon-c-scale-to-original"></i></a>
                </li>
                <!--<li>
                    <a href="javascript:;">
                        <el-dropdown trigger="hover" @command="commandLanguage">
                            <span class="el-dropdown-link drop">{{language}}</span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="zh_CN" :disabled="this.$i18n.locale === 'zh_CN'">简体</el-dropdown-item>
                                <el-dropdown-item command="en_US" :disabled="this.$i18n.locale === 'en_US'">English</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </a>
                </li>-->
                <li>
                    <a href="javascript:;">
                        <el-dropdown trigger="hover" @command="commandUser">
                            <div class="el-dropdown-link">
                                <!--<span class="el-icon-user" style="margin-right: 0.1rem;"></span>-->
                                <span class="hd-name" style="font-size: 16px">{{nickname}}</span>
                                <el-avatar class="hd-img" :src="userAvatar"></el-avatar>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item icon="el-icon-s-custom" command="personal">个人中心</el-dropdown-item>
                                <el-dropdown-item icon="el-icon-s-check" command="password">修改密码</el-dropdown-item>
                                <el-dropdown-item icon="el-icon-s-promotion" command="loginOut" divided>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </a>
                </li>
                <li @click="isDrawer"><a href="javascript:;"><i class="el-icon-s-operation"></i></a></li>
            </ul>
            <el-drawer
                    title="我是标题"
                    :visible.sync="drawer"
                    :append-to-body="true"
                    :modal="true"
                    size="20%"
                    :with-header="false">
                <span>我来啦!</span>
            </el-drawer>
        </el-header>
    </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
    name: 'sys-header',
    data() {
        return {
            dialogPassword: false,
            drawer: false
        }
    },
    mounted() {
        let avatar = this.$cookies.get('avatar');
        let nickname = this.$cookies.get('nickname');
        this.$store.dispatch('updateAvatar', avatar);
        this.$store.dispatch('updateUser', {nickname: nickname})
    },
    methods: {
        isHeader() {
            if (document.body.clientWidth > 1200) {
                this.$store.dispatch('collapse', !this.$store.state.collapse)
            } else {
                this.$message.warning('分辨率过低禁止展开侧边栏')
            }
        },
        passwordDialog(password) {
            this.dialogPassword = password
        },
        password(password) {
            this.dialogPassword = password
        },
        commandUser(command) {
            switch (command) {
            case 'personal':
                this.$router.push('/user/info');
                break;
            case 'password':
                this.$emit('password', true);
                break;
            case 'loginOut':
                this.$confirm('是否退出登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('loginOut');
                    this.$router.push('/login')
                }).catch(() => {
                    this.$message.info('取消退出登录')
                });
                break
            }
        },
        notice() {
            this.$router.push('/user/message')
        },
        screen() {
            if (screenfull.isEnabled) {
                let that = this;
                screenfull.toggle().then(() => {
                    that.$store.commit('INNER_HEIGHT', document.documentElement.clientHeight)
                })
            } else {
                this.$message.warning('不支持全屏')
            }
        },
        isTags() {
            this.$store.dispatch('tagsTop', !this.$store.state.tagsTop);
        },
        isDrawer() {
            this.$message.warning('功能模块开发中，敬请期待~')
        }
    },
    computed: {
        collapse() {
            return this.$store.state.collapse
        },
        userAvatar() {
            return this.$store.state.avatar
        },
        nickname() {
            return this.$store.state.nickname
        }
    }
}
</script>

<style lang="scss">
    .el-header {
        padding: 0;
        position: absolute;
        z-index: 3;
        left: 260px;
        right: 0;
        height: 60px!important;
        line-height: 60px;
        background-color: #fff;
        box-sizing: border-box;
        -webkit-transition: left .28s;
        transition: left .28s;

        .el-header-nav {
            height: 60px;
            position: relative;
        }

        .drop {
            font-size: 16px;
        }

        .el-ul {
            padding: 0 1px;

            li {
                height: 60px;
                float: left;
                line-height: 60px;

                a {
                    display: block;
                    color: rgb(86, 86, 86);
                    padding: 0 15px;
                    font-size: 25px;

                    .el-dropdown-link {
                        display: flex;
                        display: -webkit-flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .hd-img {
                        margin-left: 10px;
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
                    }

                }

                a:hover {
                    color: #409EFF;
                    cursor: pointer;

                    .hd-name {
                        color: #409EFF;
                    }
                }

                .el-badge__content {
                    margin-top: 12px;
                    padding: 0 5px;
                }
            }
        }

        .el-ul-left {
            position: absolute;
            top: 0;
            left: 0;
        }

        .el-ul-right {
            position: absolute;
            right: 0;
            top: 0;
        }

        .el-dropdown {
            display: block;
            font-size:25px;
        }

        .icon-gengduo {
            transform: rotate(90deg);
            -ms-transform: rotate(90deg); /* Internet Explorer */
            -moz-transform: rotate(90deg); /* Firefox */
            -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
            -o-transform: rotate(90deg);
        }
    }
</style>
