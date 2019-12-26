<template>
  <el-aside width="auto">
    <vue-scroll>
      <el-menu :popper-append-to-body="true" :class="['el-menu-vertical-demo',collapse ? 'el-menu-close' : 'el-menu-open']"
               :router="true" :collapse="collapse" :unique-opened="true" background-color="#fff" ref="elMenu"
               :default-active="$route.path" text-color="#565656" active-text-color="#fff">
        <div class="el-logo">
          <!--        <i class="el-icon-lollipop"></i>-->
          <span>饺子包</span>
        </div>
        <template v-for="item in this.routes">
          <el-submenu :index="item.id+''" :key="item.id" v-if="item.children.length > 0">
            <template slot="title">
              <i :class="item.icon ? item.icon : 'el-icon-location'"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <template v-for="group in item.children">
              <el-menu-item :index="group.path +'/'+ url(group.component)" :key="group.id" v-if="group.children.length <= 0">
                <i :class="group.icon"></i>{{ group.name }}
              </el-menu-item>
              <el-submenu :index="group.path + '/' + url(group.component)" :key="group.id" v-else>
                <template slot="title">
                  <i :class="group.icon ? group.icon : 'el-icon-location'"></i>
                  <span slot="title">{{ group.name }}</span>
                </template>
                <el-menu-item :index="sub.path + '/' + url(sub.component)" v-for="sub in group.children" :key="sub.id">
                  <i :class="sub.icon ? sub.icon : 'el-icon-location'"></i>{{ sub.meta.title }}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-submenu>
          <el-menu-item :index="item.path + '/' + url(item.component)" class="single" :key="item.id" v-else>
            <i :class="item.icon ? item.icon : 'el-icon-setting'"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </vue-scroll>
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

<style lang="scss">
  .el-menu--vertical {
    .el-menu-item, .el-submenu__title {
      height: 2.5rem;
      line-height: 2.5rem;
      transition: padding 0.35s ease 0s !important;
      i {
        width: 24px;
        text-align: center;
        font-size: 1.2rem;
        vertical-align: middle;
        margin-right: 0.8rem!important;
      }
    }
    .el-menu-item:hover, .el-submenu__title:hover {
      padding-left: 30px!important;
      color: #409EFF!important;
      background-color: #ffffff!important;
      i {
        color: #409EFF!important;
      }
    }
    .is-active {
      color: #409EFF!important;
      background-color: #f0faff!important;
    }
    .is-active:hover {
      color: #409EFF!important;
      background-color: #f0faff!important;
    }
    .el-menu--popup {
      min-width: 160px!important;
      border-radius: 0.3rem;
    }

  }
  .el-submenu__icon-arrow {
    font-weight: bold;
  }
  .single {
    .el-tooltip:hover {
      //background-color: whitesmoke!important;
      //border-radius: 0.3rem;
      i {
        color: #409EFF!important;
      }
    }
  }
</style>
