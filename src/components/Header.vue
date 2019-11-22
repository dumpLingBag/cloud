<template>
    <el-header class="el-header-nav" height="60px" :style="collapse ? 'left:84px' : 'left:245px'">
        <ul class="el-ul el-ul-left ul-icon" style="float: left">
            <li @click="isHeader()" :title='collapse ? "打开侧栏" : "关闭侧栏"'>
                <a href="javascript:;"><i
                        :class="collapse ? 'el-icon-s-operation' : 'el-icon-s-operation'"></i></a>
            </li>
        </ul>
        <ul class="el-ul el-ul-right ul-icon" style="float: right">
            <li @click="notice()">
                <a href="javascript:;"><i class="el-icon-close-notification"></i></a>
            </li>
            <li @click="screen()"><a href="javascript:;"><i class="el-icon-full-screen"></i></a></li>
            <li>
                <a href="javascript:;">
                    <el-dropdown trigger="hover" @command="commandUser">
                        <div class="el-dropdown-link">
                            <span class="hd-name" style="font-size: 16px">{{user.name === undefined || user.name === '' ? '请登录' : user.name}}</span>
                            <el-avatar class="hd-img" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                            <el-dropdown-item command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item command="loginOut" divided>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </a>
            </li>
        </ul>
    </el-header>
</template>

<script>
    import screenfull from 'screenfull'

    export default {
        name: 'Header',
        data() {
            return {
                collapse: false
            }
        },
        methods: {
            isHeader() {
                this.collapse = !this.collapse;
                this.$store.dispatch('collapse', this.collapse)
            },
            errorHandler() {
                return true
            },
            commandUser(command) {
                switch (command) {
                    case 'personal':
                        this.$router.push('/userInfo');
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
                            this.$message({
                                type: 'info',
                                message: '取消退出登录'
                            })
                        });
                        break
                }
            },
            notice() {
                this.$router.push('/message')
            },
            screen() {
                if (screenfull.enabled) {
                    screenfull.toggle()
                } else {
                    this.$message({message: '不支持全屏', type: 'warning'})
                }
            }
        },
        computed: {
            user() {
                return this.$store.state.user
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-header {
        padding: 0;
        z-index: 1;
        position: fixed;
        top: 15px;
        left: 245px;
        right: 15px;
        //width: 100%;
        border-radius: 0.5rem;
        background-color: #fff;
        box-sizing: border-box;
        //border-bottom: 1px solid #f6f6f6;
        box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
        -webkit-transition: left .3s ease-in-out;
        transition: left .3s ease-in-out;

        .el-header-nav {
            height: 60px;
            position: relative;

            .el-dropdown {
                display: block;
            }
        }

        .el-ul {
            padding: 0 10px;

            li {
                height: 60px;
                float: left;
                line-height: 60px;

                a {
                    display: block;
                    color: #000;
                    padding: 0 15px;
                    font-size: 24px;

                    .photo {
                        width: 45px;
                        height: 45px;
                    }
                    .el-dropdown-link {
                      display: flex;
                      display: -webkit-flex;
                      flex-direction: row;
                      flex-wrap: nowrap;
                      justify-content: space-between;
                      //align-items: center;
                    }

                    .hd-img {
                      margin-left: 10px;
                      margin-top: 8px;
                      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
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
            -webkit-transition: left .3s ease-in-out;
            transition: left .3s ease-in-out;
        }

        .el-ul-right {
            position: absolute;
            right: 0;
            top: 0;
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
