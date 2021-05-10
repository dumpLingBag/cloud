<template>
    <div class="page-tags" :style="collapse ? 'left:90px' : 'left:270px'">
        <div class="tags-control icon-prev" @click="goHome">
            <div :class="['home', this.$route.path === '/main' ? 'active' : '']">
                <span class="tag-name">主控台</span>
            </div>
        </div>
        <div class="tags-control icon-downs">
            <el-dropdown trigger="hover" @command="commandTags">
                <span class="el-dropdown-link" style="font-size: 18px"><i class="el-icon-arrow-down"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="closeCurrent">关闭当前页</el-dropdown-item>
                    <el-dropdown-item command="closeOther">关闭其他页</el-dropdown-item>
                    <el-dropdown-item command="closeAll">关闭所有页</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <vue-scroll>
            <div class="tags">
                <div class="tabs__nav" style="transform: translateX(0px)">
                    <template v-for="(item,index) in Array.from(visitedViews)">
                        <div :class="['tabs__item', isActive(item) ? 'active' : '']"
                             :key="index" v-if="item.path !== '/main'" @click="go(item.path)" @dblclick="reloadView">
                            <span class="tag-name">{{item.name}}</span>
                            <span class="el-icon-close" @click.prevent.stop="closeTags(item)"></span>
                        </div>
                    </template>
                </div>
            </div>
        </vue-scroll>
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
                if (path !== this.$route.path) {
                    this.$router.push(path)
                }
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
        top: 60px;
        right: 0;
        left: 280px;
        color: #808695;
        border-radius: 3px;
        z-index: 2;
        height: 44px;
        line-height: 44px;
        padding: 0 52px 0 73px;
        box-sizing: border-box;
        overflow: hidden;
        -webkit-transition: left .28s;
        transition: left .28s;

        .icon-prev {
            left: 0;
            padding: 6px 0;
            width: 73px;

            .home {
                background: #ffffff;
                height: 32px;
                line-height: 32px;
                border-radius: 3px;
                margin: 0 5px 0 0;
                transition: all .3s cubic-bezier(.645, .045, .355, 1), width .3s cubic-bezier(.645, .045, .355, 1);
            }

            .home:hover {
                span {
                    color: #515a6e;
                }
            }

            .active {
                .tag-name {
                    color: #409EFF;
                }
            }
        }

        .icon-next {
            right: 40px;
        }

        .icon-downs {
            right: 0;
            padding: 6px 0;
            width: 52px;
            .el-dropdown {
                width: 40px;
                display: block;
                background: #ffffff;
                height: 32px;
                line-height: 32px;
                border-radius: 3px;
                margin: 0 12px 0 0;
            }
            .el-dropdown:hover {
                color: #515a6e;
            }
        }

        .tags-control {
            position: absolute;
            top: 0;
            height:44px;
            line-height: 44px;
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
                background: #ffffff;

                .el-icon-close {
                    position: relative;
                    font-size: 14px;
                    width: 14px;
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
                .tag-name {
                    color: #409EFF;
                    background: #ffffff;
                }
            }

            .active:hover {
                .tag-name {
                    color: #409eff;
                }
            }
        }

        .tabs__item {
            padding: 0 10px 0 16px;
            height: 32px;
            box-sizing: border-box;
            line-height: 32px;
            display: inline-block;
            list-style: none;
            font-size: 14px;
            color: #808695;
            position: relative;
            background: whitesmoke;
            border-radius: 3px;
            margin-right: 5px;

            .el-icon-close {
                border-radius: 50%;
                text-align: center;
                transition: all .3s cubic-bezier(.645, .045, .355, 1);
                margin-left: 5px;
                width: 14px;
            }

            /*.el-icon-close:hover {
                background-color: #F56C6C;
                color: #ffffff;
            }*/
        }

        .tabs__item:hover {
            cursor: pointer;
            color: #515a6e;

            /*.el-icon-close {
                width: 14px;
            }*/
        }
    }
</style>
