<template>
  <div class="index">
    <el-container>
      <v-aside></v-aside>
      <el-container>
        <v-header v-on:password="password"></v-header>
        <v-password :dialogPassword="dialogPassword" v-on:closePasswordDialog="passwordDialog"></v-password>
        <v-tags></v-tags>
        <el-main style="padding: 15px" :style="collapse ? 'left:69px' : 'left:230px'">
            <transition name="move" mode="out-in">
              <keep-alive :include="tagList">
                <router-view></router-view>
              </keep-alive>
            </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vPassword from '@/components/Password'
import vTags from '@/components/Tags'
import vAside from '@/components/Aside'
import vHeader from '@/components/Header'

export default {
  name: 'Index',
  data () {
    return {
      dialogPassword: false
    }
  },
  components: {
    vPassword, vTags, vAside, vHeader
  },
  methods: {
    passwordDialog (password) {
      this.dialogPassword = password
    },
    password (password) {
      this.dialogPassword = password
    }
  },
  computed: {
    collapse () {
      return this.$store.state.collapse
    },
    tagList () {
      return this.$store.state.tagList
    }
  },
  created () {
    if (!this.$store.state.menuList || this.$store.state.menuList.length <= 0) {
      this.$router.push('/login')
    }
    if (this.$route.path === '' || this.$route.path === '/') {
      this.$router.push('/main')
    }
  }
}
</script>

<style lang="scss">
  @import '~@/assets/scss/index';
  .move-enter-active,.move-leave-active{
    transition: all .5s;
  }
  .move-enter{
    opacity: 0;
    transform: translateX(-30px);
  }
  .move-leave-to{
    opacity: 0;
    transform: translateX(30px);
  }
  .__view {
    width: 100%!important;
  }
</style>
