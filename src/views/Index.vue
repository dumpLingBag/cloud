<template>
  <div class="index">
    <el-container>
      <v-aside></v-aside>
      <el-container>
        <v-header v-on:password="password"></v-header>
        <transition name="tags" mode="out-in">
          <v-tags v-show="tagsTop"></v-tags>
        </transition>
        <v-password :dialogPassword="dialogPassword" v-on:closePasswordDialog="passwordDialog"></v-password>
        <el-main :style="{left: collapse ? '100px' : '280px', top: tagsTop ? '135px' : '90px',
          'border-radius' : '0.3rem', 'overflow' : 'auto'}">
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
      dialogPassword: false,
      tag: true
    }
  },
  components: {
    vPassword, vTags, vAside, vHeader
  },
  mounted () {
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
    },
    tagsTop () {
      return this.$store.state.tagsTop
    }
  },
  created () {
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
  .move-enter-active,.move-leave-active {
    transition: all .5s;
  }
  .move-enter {
    opacity: 0;
    transform: translateX(-30px);
  }
  .move-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  .tags-enter-active,.tags-leave-active {
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
    width: 100%!important;
  }
</style>
