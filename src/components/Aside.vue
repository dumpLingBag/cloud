<template>
  <el-aside width="auto">
    <el-menu :popper-append-to-body="true" class="el-menu-vertical-demo" :router="true" :collapse="collapse" :unique-opened="true" background-color="#20222A" ref="elMenu"
             :default-active="$route.path" text-color="rgba(255,255,255,.7)" active-text-color="#fff">
      <div class="el-logo"><span>饺子包</span></div>
      <template v-for="item in this.routes">
        <el-submenu :index="item.id+''" :key="item.id" v-if="item.children.length > 0">
          <template slot="title">
            <i :class="item.icon !== undefined && item.icon !== '' ? item.icon : 'el-icon-location'"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <template v-for="group in item.children">
            <el-menu-item :index="group.path +'/'+ url(group.component)" :key="group.id" v-if="group.children.length <= 0">
              {{ group.name }}
            </el-menu-item>
            <el-submenu :index="group.path + '/' + url(group.component)" :key="group.id" v-else>
              <span slot="title">{{ group.name }}</span>
              <el-menu-item :index="sub.path" v-for="sub in group.children" :key="sub.id">{{ sub.meta.title }}</el-menu-item>
            </el-submenu>
          </template>
        </el-submenu>
        <el-menu-item :index="item.path + '/' + url(item.component)" class="single" :key="item.id" v-else>
          <i :class="item.icon !== undefined && item.icon !== '' ? item.icon : 'el-icon-setting'"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import lineUtil from '@/utils/humpToLine'
export default {
  name: 'Aside',
  data () {
    return {
      index: ''
    }
  },
  watch: {
    $route (to, original) {
      if (to.path === '/main') {
        this.close(this.index)
      }
    }
  },
  methods: {
    close (index) {
      this.$refs.elMenu.close(index)
    },
    url (str) {
      return lineUtil.line(str)
    }
  },
  computed: {
    routes () {
      return this.$store.state.menuList
    },
    collapse () {
      return this.$store.state.collapse
    }
  }
}
</script>

<style scoped>

</style>
