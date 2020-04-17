<template>
    <div class="page-tags" :style="collapse ? 'left:100px' : 'left:280px'">
        <div class="tags-control icon-prev" @click="goHome">
            <div :class="['home', this.$route.path === '/main' ? 'active' : '']">
                <span class="iconfont icon-emojiflashfill"></span>
            </div>
        </div>
        <div class="tags-control icon-downs">
            <el-dropdown trigger="hover" @command="commandTags">
                <span class="el-dropdown-link" style="font-size: 18px"><i class="el-icon-arrow-down"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="closeCurrent">关闭当前标签页</el-dropdown-item>
                    <el-dropdown-item command="closeOther">关闭其他标签页</el-dropdown-item>
                    <el-dropdown-item command="closeAll">关闭全部标签页</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="tags">
            <vue-scroll>
                <div class="tabs__nav" style="transform: translateX(0px)">
                    <template v-for="(item,index) in Array.from(visitedViews)">
                        <div :class="['tabs__item', isActive(item) ? 'active' : '']"
                             :key="index" v-if="item.path !== '/main'" @click="go(item.path)" @dblclick="reloadView">
                            <span>{{item.name}}</span>
                            <span class="el-icon-close" @click.prevent.stop="closeTags(item)"></span>
                        </div>
                    </template>
                </div>
            </vue-scroll>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Tags',
        inject: ['reload'],
        data() {
            return {
                tagsWidth: 0,
                tagsTitleWidth: 0,
                tags: ''
            }
        },
        watch: {
            $route(newVal) {
                this.addViewTags();
                const isTags = this.visitedViews.some(item => {
                    return item.path === newVal.path
                });
                if (!isTags) {
                    const li = window.document.getElementsByClassName('tags-li');
                    for (let i = 0; i < li.length; i++) {
                        this.tagsWidth = Number(this.tagsWidth) + Number(li[i].offsetWidth)
                    }
                }
            }
        },
        mounted() {
            this.addViewTags();
        },
        methods: {
            go(path) {
                this.$router.push(path)
            },
            goHome() {
                this.$router.push('/main')
            },
            generateRoute() {
                if (this.$route.name) {
                    return this.$route
                }
                return false
            },
            isActive(route) {
                return route.path === this.$route.path
            },
            addViewTags() {
                const route = this.generateRoute();
                if (!route) {
                    return false
                }
                this.$store.dispatch('addVisitedViews', route)
            },
            // 关闭单个标签
            closeTags(view) {
                this.$store.dispatch('delVisitedViews', view).then((views) => {
                    if (this.isActive(view)) {
                        const item = views.slice(-1)[0];
                        if (item) {
                            this.$router.push(item.path)
                        } else {
                            this.$router.push('/main')
                        }
                    }
                })
            },
            closeCurrent() {
                this.closeTags(this.$route)
            },
            closeOther() {
                this.$store.dispatch('delOthersViews', this.$route)
            },
            closeAll() {
                this.$store.dispatch('delAllViews');
                this.$router.push('/main')
            },
            commandTags(command) {
                switch (command) {
                    case 'closeCurrent':
                        this.closeCurrent();
                        break;
                    case 'closeOther':
                        this.closeOther();
                        break;
                    case 'closeAll':
                        this.closeAll();
                        break
                }
            },
            reloadView() {
                this.reload()
            }
        },
        computed: {
            collapse() {
                return this.$store.state.collapse
            },
            visitedViews() {
                return this.$store.state.visitedViews
            }
        }
    }
</script>

<style lang="scss">
    .page-tags {
        position: absolute;
        top: 75px;
        right: 20px;
        left: 245px;
        color: rgb(86, 86, 86);;
        border-radius: 0.3rem;
        margin-top: 5px;
        height: 40px;
        line-height: 40px;
        padding: 0 40px 0 50px;
        background-color: #fff;
        box-sizing: border-box;
        overflow: hidden;
        -webkit-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
        -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);

        .icon-prev {
            left: 0;
            padding: 5px 0;

            .home {
                background: whitesmoke;
                border-radius: 3px;
                margin: 0 5px;
                height: 30px;
                line-height: 30px;
                transition: all .3s cubic-bezier(.645, .045, .355, 1), width .3s cubic-bezier(.645, .045, .355, 1);
            }

            .home:hover {
                background-color: #409EFF;

                span {
                    color: #ffffff;
                }
            }

            .active {
                background-color: #409EFF;

                span {
                    color: #ffffff;
                }
            }
        }

        .icon-next {
            right: 40px;
        }

        .icon-downs {
            right: 0;
        }

        .tags-control {
            position: absolute;
            top: 0;
            width: 50px;
            height: 100%;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            box-sizing: border-box;
        }

        .tabs__nav {
            white-space: nowrap;
            position: relative;
            transition: transform .3s;
            float: left;

            .tabs__item {
                transition: color .3s cubic-bezier(.645, .045, .355, 1), padding .3s cubic-bezier(.645, .045, .355, 1);
                -moz-user-select: none;
                -khtml-user-select: none;
                user-select: none;

                .el-icon-close {
                    position: relative;
                    font-size: 12px;
                    width: 0;
                    height: 14px;
                    vertical-align: middle;
                    line-height: 15px;
                    overflow: hidden;
                    top: -1px;
                    right: -2px;
                    transform-origin: 100% 50%;
                }
            }

            .active {
                background-color: #409EFF;
                color: #ffffff;
            }
        }

        .tabs__item {
            padding: 0 10px 0 15px;
            height: 30px;
            box-sizing: border-box;
            line-height: 30px;
            display: inline-block;
            list-style: none;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            position: relative;
            background: whitesmoke;
            border-radius: 3px;
            margin-right: 5px;

            .el-icon-close {
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                margin-left: 5px;
            }

            .el-icon-close:hover {
                background-color: #F56C6C;
            }
        }

        .tabs__item:last-child {
            margin-right: 0;
        }

        .tabs__item:hover {
            cursor: pointer;
            background-color: #409EFF;
            color: #ffffff;

            .el-icon-close {
                width: 14px;
                color: #ffffff;
            }
        }
    }
</style>
