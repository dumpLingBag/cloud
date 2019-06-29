<template>
  <div class="page-tags" :style="collapse ? 'left:69px' : 'left:230px'">
    <div class="tags-control icon-prev" @click="prev">
      <span class="el-icon-d-arrow-left"></span>
    </div>
    <div class="tags-control icon-next" @click="next">
      <span class="el-icon-d-arrow-right"></span>
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
      <ul class="tags-title" style="left: 0" ref="tags">
        <li :class="[$route.path === '/main' ? 'active' : '', 'tags-home']">
          <router-link to="/main">
            <span class="iconfont icon-emojiflashfill"></span>
          </router-link>
        </li>
        <template v-for="(item,index) in Array.from(visitedViews)">
          <router-link :to="item.path" :key="item.id" v-if="item.name !== '主视图' && item.path !== '/main'">
            <li :class="[isActive(item) ? 'active' : '', 'tags-li']" :key="index">
              <span class="tags-name">{{item.name}}</span>
              <i class="el-icon-close" @click.prevent.stop="closeTags(item)"></i>
            </li>
          </router-link>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  data () {
    return {
      tagsWidth: 0,
      tagsTitleWidth: 0
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
    prev () {
      if (this.tagsWidth > this.tagsTitleWidth) {
        let left = this.$refs.tags.style.left;
        let leftInt = parseInt(left.replace('px'));
        if (leftInt <= 0) {
          this.$refs.tags.style.left = String(leftInt + -100) + 'px'
        }
      }
    },
    next () {
      if (this.tagsWidth > this.tagsTitleWidth) {
        let left = this.$refs.tags.style.left;
        let leftInt = parseInt(left.replace('px'));
        if (leftInt !== 0) {
          this.$refs.tags.style.left = String(leftInt + 100) + 'px'
        }
      }
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

<style lang="scss" scoped>
  .page-tags {
    height: 40px;
    left: 230px;
    line-height: 40px;
    padding: 0 80px 0 40px;
    background-color: #fff;
    box-sizing: border-box;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
    .icon-prev{
      left: 0;
      border-left: none;
      border-right: 1px solid #f6f6f6;
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
      width: 40px;
      height: 100%;
      text-align: center;
      cursor: pointer;
      transition: all .3s;
      -webkit-transition: all .3s;
      box-sizing: border-box;
      border-left: 1px solid #f6f6f6;
    }
    .tags-control:hover{
      background-color: #f6f6f6;
    }
    .tags{
      margin: 0;
      overflow: hidden;
      -webkit-transition: left .3s ease-in-out;
      transition: left .3s ease-in-out;
      .tags-title{
        height: 40px;
        border: none;
        li{
          min-width: 0;
          line-height: 40px;
          max-width: 160px;
          text-overflow: ellipsis;
          padding-right: 40px;
          overflow: hidden;
          border-right: 1px solid #f6f6f6;
          vertical-align: top;
          i{
            margin-left: 5px;
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
        li:first-child{
          padding-right: 15px;
          span{
            font-size: 16px;
            color: #666;
          }
          .active{
            color: #000;
          }
        }
        .tags-name{
          color: #666;
        }
      }
    }
  }
  .page-tags{
    position: fixed;
    top: 50px;
    right: 0;
    z-index: 1;
  }
  .tags-title{
    position: relative;
    left: 0;
    height: 40px;
    white-space: nowrap;
    font-size: 0;
    border-bottom: 1px solid;
    transition: all .2s;
    -webkit-transition: all .2s;
    li{
      display: inline-block;
      *display: inline;
      *zoom: 1;
      vertical-align: middle;
      font-size: 14px;
      transition: all .2s;
      -webkit-transition: all .2s;
      position: relative;
      line-height: 40px;
      min-width: 65px;
      padding: 0 15px;
      text-align: center;
      cursor: pointer;
    }
    .active{
      background-color: #f6f6f6;
      .tags-name{
        color: #000;
      }
    }
    .active:after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      border-radius: 0;
      background-color: #292B34;
      transition: all .3s;
      -webkit-transition: all .3s;
    }
    li:after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 2px;
      border-radius: 0;
      background-color: #292B34;
      transition: all .3s;
      -webkit-transition: all .3s;
    }
    li:hover{
      background-color: #f6f6f6;
    }
    li:not(.active):hover::after{
      -webkit-animation: open ease .3s;
      -o-animation: open ease .3s;
      animation: open ease .3s;
      animation-fill-mode: forwards;
    }
    /*.open::after{
      -webkit-animation: open ease .3s;
      -o-animation: open ease .3s;
      animation: open ease .3s;
      animation-fill-mode: forwards;
    }
    .close::after{
      -webkit-animation: close ease .3s;
      -o-animation: close ease .3s;
      animation: close ease .3s;
      animation-fill-mode: forwards;
    }*/
  }
  @keyframes open {
    from {width: 0}
    to {width: 100%}
  }

  @keyframes close {
    from {width: 100%}
    to {width: 0}
  }
</style>
