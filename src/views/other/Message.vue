<template>
  <div class="message vue-padding">
    <div class="tips">{{$route.name}}</div>
    <div>
      <el-tabs :tab-position="tabPosition" @tab-click="tabClick($event.index)">
        <el-tab-pane :label="'未读消息('+ haveReadList.length +')'">
          <div :style="isHeight ? 'max-height:' + maxHeight : ''">
            <vue-scroll>
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    <span :class="['message-title', system ? 'hot' : '']">【系统通知】该系统将于今晚凌晨2点到5点进行升级维护</span>
                    <div class="message-time">2018-04-19 20:00:00<el-button size="small" @click.prevent.stop="haveRead()">标为已读</el-button></div>
                  </template>
                  <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                  <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item>
                  <template slot="title">
                    <span :class="['message-title', system ? 'hot' : '']">今晚12点整发大红包，先到先得</span>
                    <div class="message-time">2018-04-19 20:00:00<el-button size="small" @click.prevent.stop="haveRead()">标为已读</el-button></div>
                  </template>
                  <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                  <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
              </el-collapse>
            </vue-scroll>
          </div>
          <div class="message-handle">
            <el-button type="primary" @click="haveReadAll()">全部标为已读</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'已读消息('+ unreadList.length +')'">
          <div :style="isHeight ? 'max-height:' + maxHeight : ''">
            <vue-scroll>
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    <span :class="['message-title', system ? 'hot' : '']">【系统通知】该系统将于今晚凌晨2点到5点进行升级维护</span>
                    <div class="message-time">2018-04-19 20:00:00<el-button size="small" type="danger" @click.prevent.stop="unread()">删除</el-button></div>
                  </template>
                  <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                  <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item>
                  <template slot="title">
                    <span :class="['message-title', system ? 'hot' : '']">今晚12点整发大红包，先到先得</span>
                    <div class="message-time">2018-04-19 20:00:00<el-button size="small" type="danger" @click.prevent.stop="unread()">删除</el-button></div>
                  </template>
                  <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                  <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
              </el-collapse>
            </vue-scroll>
          </div>
          <div class="message-handle">
            <el-button type="danger" @click="unreadAll()">删除全部</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'回收站('+ recycleBinList.length +')'">
          <div :style="isHeight ? 'max-height:' + maxHeight : ''">
            <vue-scroll>
              <el-collapse accordion>
                <el-collapse-item>
                  <template slot="title">
                    <span :class="['message-title', system ? 'hot' : '']">【系统通知】该系统将于今晚凌晨2点到5点进行升级维护</span>
                    <div class="message-time">2018-04-19 20:00:00<el-button size="small" @click.prevent.stop="recycleBin()">还原</el-button></div>
                  </template>
                  <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                  <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
                <el-collapse-item>
                  <template slot="title">
                    <span :class="['message-title', system ? 'hot' : '']">今晚12点整发大红包，先到先得</span>
                    <div class="message-time">2018-04-19 20:00:00<el-button size="small" @click.prevent.stop="recycleBin()">还原</el-button></div>
                  </template>
                  <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                  <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                </el-collapse-item>
              </el-collapse>
            </vue-scroll>
          </div>
          <div class="message-handle">
            <el-button type="danger" @click="deleteAll()">清空回收站</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  data () {
    return {
      tabPosition: 'top',
      isHeight: false,
      maxHeight: window.innerHeight - 369,
      haveReadList: [],
      unreadList: [],
      recycleBinList: [],
      system: true
    }
  },
  mounted () {
    let clientHeight = document.getElementsByClassName('el-tabs__content')[0].clientHeight
    if (clientHeight > window.innerHeight - 369) {
      this.isHeight = !this.isHeight
    }
    this.tabClick(0)
  },
  methods: {
    haveRead () { // 标为已读
      alert('111')
    },

    unread () { // 删除
      alert('222')
    },

    recycleBin () { // 还原
      alert('333')
    },

    haveReadAll (data) { // 标记全部
      console.log(data)
    },

    unreadAll (data) { // 删除全部

    },

    deleteAll (data) { // 清空回收站

    },

    tabClick (data) {
      this.$api.httpGet(this.$url.Message.load + '/' + data).then(res => {
        if (res.code === 0) {
          this.messageList(data, res.data)
        }
      })
    },

    messageList (index, data) {
      if (data && data.length > 0) {
        switch (index) {
          case 0:
            this.haveReadList = data
            break
          case 1:
            this.unreadList = data
            break
          case 2:
            this.recycleBinList = data
            break
          default:
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .message .el-collapse-item__header {
    font-weight: 500;
  }
  .message-title {
    font-size: 15px;
  }
  .hot {
    color: red;
  }
  .message-time {
    position: absolute;
    right: 50px;
    font-weight: normal;
    button {
      margin-left: 50px;
    }
  }
  .message-handle {
    margin-top: 20px;
  }
</style>
