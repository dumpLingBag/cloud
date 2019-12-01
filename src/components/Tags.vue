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
        <ul class="tags-title" style="left: 0" ref="tags">
          <template v-for="(item,index) in Array.from(visitedViews)">
            <li :class="[isActive(item) ? 'active' : '', 'tags-li']" :key="index" @mouseenter="tags = item.path" @mouseleave="tags = ''"
                v-if="item.name !== '主视图' && item.path !== '/main'" @click="go(item.path)">
              <span class="tags-name">{{item.name}}</span>
              <transition name="move" mode="out-in">
                <i class="el-icon-close" v-show="item.path === tags" @click.prevent.stop="closeTags(item)"></i>
              </transition>
            </li>
          </template>
        </ul>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  data () {
    return {
      tagsWidth: 0,
      tagsTitleWidth: 0,
      tags: ''
    }
  },
  watch: {
    $route (newVal) {
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
  mounted () {
    this.addViewTags();
    const li = window.document.getElementsByClassName('tags-li');
    const home = window.document.getElementsByClassName('tags-home');
    if (li.length > 0) {
      this.tagsWidth = this.tagsWidth + li[0].offsetWidth + home[0].offsetWidth
    }
    const title = window.document.getElementsByClassName('tags-title');
    this.tagsTitleWidth = title[0].clientWidth
  },
  methods: {
    go (path) {
      this.$router.push(path)
    },
    goHome () {
      this.$router.push('/main')
    },
    generateRoute () {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive (route) {
      return route.path === this.$route.path
    },
    addViewTags () {
      const route = this.generateRoute();
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    // 关闭单个标签
    closeTags (view) {
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
    closeCurrent () {
      this.closeTags(this.$route)
    },
    closeOther () {
      this.$store.dispatch('delOthersViews', this.$route)
    },
    closeAll () {
      this.$store.dispatch('delAllViews');
      this.$router.push('/main')
    },
    commandTags (command) {
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
    }
  },
  computed: {
    collapse () {
      return this.$store.state.collapse
    },
    visitedViews () {
      return this.$store.state.visitedViews
    }
  }
}
</script>

<style lang="scss">
  .page-tags {
    position: fixed;
    top: 75px;
    right: 20px;
    z-index: 1;
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
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
    -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
    .icon-prev{
      left: 0;
      padding: 5px 0;
      .home {
        background: whitesmoke;
        border-radius: 3px;
        margin: 0 5px;
        height: 30px;
        line-height: 30px;
        transition: all .3s cubic-bezier(.645,.045,.355,1),width .3s cubic-bezier(.645,.045,.355,1);
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
    .icon-next{
      right: 40px;
    }
    .icon-downs{
      right: 0;
    }
    .tags-control{
      position: absolute;
      top: 0;
      width: 50px;
      height: 100%;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      transition: all .3s ease-in-out;
      -webkit-transition: all .3s ease-in-out;
      box-sizing: border-box;
    }
    .tags{
      margin: 0;
      overflow: hidden;
      -webkit-transition: width .3s ease-out;
      transition: width .3s ease-out;
      .tags-title{
        padding: 5px 0;
        position: relative;
        white-space: nowrap;
        transition: all .5s;
        -webkit-transition: all .5s;
        height: 30px;
        line-height: 30px;
        .tags-li>.tags-name{
          font-size: 14px;
          color: #666;
        }
        .tags-li:hover{
          background: #409EFF;
          .tags-name{
            color: #ffffff;
          }
          .el-icon-close{
            color: #ffffff;
            transition: all .3s cubic-bezier(.645,.045,.355,1);
          }
        }
        .active{
          background: #409EFF;
          color: #ffffff;
          .tags-name{
            color: #ffffff;
          }
        }
        li{
          display: inline-block;
          min-width: 0;
          height: 30px;
          line-height: 30px;
          max-width: 160px;
          text-overflow: ellipsis;
          overflow: hidden;
          border-radius: 3px;
          margin-right: 5px;
          background: whitesmoke;
          vertical-align: top;
          padding: 0 15px;
          text-align: center;
          cursor: pointer;
          transition: all .3s cubic-bezier(.645,.045,.355,1),width .3s cubic-bezier(.645,.045,.355,1);
          i{
            margin-left: 6px;
            width: 16px;
            height: 16px;
            line-height: 16px;
            border-radius: 50%;
            font-size: 14px;
          }
          i:hover{
            color: #fff;
            background-color: #F56C6C;
          }
        }
      }
    }
    .move-enter-active,.move-leave-active {
      transition: all .3s;
    }
    .move-enter {
      opacity: 0;
      transform: translateX(-20px);
    }
    .move-leave-to {
      opacity: 0;
      transform: translateX(20px);
    }
  }
</style>
