<template>
    <el-aside :width="collapse ? '80px' : '260px'">
        <vue-scroll>
            <div class="menu-padding">
                <el-menu :popper-append-to-body="true" :collapse-transition="false"
                         :class="['el-menu-vertical-demo',collapse ? 'el-menu-close' : 'el-menu-open']"
                         :router="true" :collapse="collapse" :unique-opened="true" background-color="rgba(0, 21, 41, 1)"
                         ref="elMenu"
                         :default-active="$route.path" text-color="rgba(255,255,255,.65)" active-text-color="#fff">
                    <div class="el-logo">
                        <span>{{collapse ? 'Dp' : 'Dumpling'}}</span>
                    </div>
                    <sidebar-item v-for="item in this.routes" :key="item.id" :item="item"></sidebar-item>
                </el-menu>
            </div>
        </vue-scroll>
    </el-aside>
</template>

<script>
    import sidebarItem from './SidebarItem'
    export default {
        name: "Aside",
        components: {
            sidebarItem
        },
        data() {
            return {
                index: ''
            }
        },
        watch: {
            $route(to) {
                if (to.path === '/main') {
                    this.close(this.index)
                }
            }
        },
        methods: {
            close(index) {
                this.$refs.elMenu.close(index)
            },
            url(str) {
                return this.$common.toLine(str)
            }
        },
        computed: {
            routes() {
                return this.$store.state.menuList
            },
            collapse() {
                return this.$store.state.collapse
            }
        }
    }
</script>

<style lang="scss">
    .el-menu--vertical {
        .el-menu-item, .el-submenu__title {
            height: 35px;
            line-height: 36px;
            i {
                width: 24px;
                text-align: center;
                font-size: 15px;
                vertical-align: middle;
                margin-right: 8px !important;
            }
        }

        .el-menu-item:hover, .el-submenu__title:hover {
            color: #ffffff !important;
            background-color: rgba(0, 21, 41, 1) !important;

            i {
                color: #ffffff !important;
            }
        }

        .is-active {
            color: #ffffff !important;
            background-color: rgba(24, 144, 255, 1) !important;
        }

        .is-active:hover {
            color: #ffffff !important;
            background-color: rgba(24, 144, 255, 1) !important;
        }

        .el-menu--popup {
            min-width: 160px !important;
            border-radius: 3px;
        }

    }

    .el-submenu__icon-arrow {
        font-weight: bold;
    }
</style>
