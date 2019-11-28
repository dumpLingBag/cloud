<template>
    <el-header class="el-header-nav radius" :style="collapse ? 'left:100px' : 'left:280px'">
        <ul class="el-ul el-ul-left ul-icon" style="float: left">
            <li @click="isHeader()" :title='collapse ? "打开侧栏" : "关闭侧栏"'>
                <a href="javascript:;">
                    <i :class="collapse ? 'el-icon-s-operation' : 'el-icon-s-operation'"></i>
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
            <li @click="screen()" title="全屏"><a href="javascript:;"><i class="el-icon-c-scale-to-original"></i></a></li>
            <li>
                <a href="javascript:;">
                    <el-dropdown trigger="hover" @command="commandUser">
                        <div class="el-dropdown-link">
                            <span class="hd-name" style="font-size: 16px">{{user.nickname}}</span>
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
            },
            isTags() {
                alert('11111')
            }
        },
        computed: {
            user() {
                return JSON.parse(window.localStorage.getItem('user'))
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
        left: 280px;
        right: 20px;
        //width: 100%;
        background-color: #fff;
        box-sizing: border-box;
        //border-bottom: 1px solid #f6f6f6;
        -webkit-transition: left .3s ease-in-out;
        transition: left .3s ease-in-out;

        .el-header-nav {
            height: 3.8rem;
            position: relative;
        }

        .el-ul {
            padding: 0 10px;

            li {
                height: 3.8rem;
                float: left;
                line-height: 3.8rem;

                a {
                    display: block;
                    color: #000;
                    padding: 0 15px;
                    font-size: 1.5rem;

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
                      //margin-top: 8px;
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
        }

        .el-ul-right {
            position: absolute;
            right: 0;
            top: 0;
        }

        .el-dropdown {
            display: block;
            font-size: 1.5rem;
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
