<template>
    <div class="index">
        <el-container>
            <v-aside class="sidebar-container"></v-aside>
            <el-container>
                <v-header v-on:password="password"></v-header>
                <transition name="tags" mode="out-in">
                    <v-tags v-show="tagsTop"></v-tags>
                </transition>
                <v-password :dialogPassword="dialogPassword" v-on:closePasswordDialog="passwordDialog"></v-password>
                <el-main :style="{left: collapse ? '80px' : '260px', top: tagsTop ? '104px' : '64px', 'overflow' : 'auto'}">
                    <!--<vue-scroll>-->
                        <transition name="move-main" mode="out-in">
                            <keep-alive :include="tagList">
                                <router-view></router-view>
                            </keep-alive>
                        </transition>
                    <!--</vue-scroll>-->
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import vPassword from '@/components/Password'
    import vTags from '@/components/tags/Tags'
    import vAside from '@/components/sidebar/Aside'
    import vHeader from '@/components/header/Header'

    export default {
        name: 'Index',
        data() {
            return {
                dialogPassword: false,
                tag: true
            }
        },
        components: {
            vPassword, vTags, vAside, vHeader
        },
        mounted() {
            const that = this;
            window.onresize = () => {
                if (document.body.clientWidth <= 1200) {
                    that.$store.dispatch('collapse', true)
                } else {
                    that.$store.dispatch('collapse', false)
                }
            }
        },
        methods: {
            passwordDialog(password) {
                this.dialogPassword = password
            },
            password(password) {
                this.dialogPassword = password
            }
        },
        computed: {
            collapse() {
                return this.$store.state.collapse
            },
            tagList() {
                return this.$store.state.tagList
            },
            tagsTop() {
                return this.$store.state.tagsTop
            }
        },
        created() {
            if (!this.$store.state.menuList || this.$store.state.menuList.length <= 0) {
                this.$router.push('/login')
            }
            if (this.$route.path === '' || this.$route.path === '/') {
                this.$router.push('/main')
            }
            if (document.body.clientWidth <= 1200) {
                this.$store.dispatch('collapse', true)
            }
        }
    }
</script>

<style lang="scss">
    @import '~@/assets/scss/index';

    .move-main-enter-active, .move-main-leave-active {
        transition: all ease-in-out .3s;
    }

    .move-main-enter {
        opacity: 0;
        //transform: translateX(-30px);
    }

    .move-main-leave-to {
        opacity: 0;
        //transform: translateX(30px);
    }

    .tags-enter-active, .tags-leave-active {
        transition: all .5s;
    }

    .tags-enter {
        opacity: 0;
        transform: translateX(-30px);
    }

    .tags-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    .__view {
        width: 100% !important;
    }
</style>
