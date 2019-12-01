<template>
    <div class="data-tabs card-table radius">
      <el-row>
        <el-col :lg="6" :sm="24" v-for="(item, index) in data" :key="index">
          <div class="item" :style="{background:item.color}">
            <div class="item-header">
              <p>{{item.title}}</p>
              <span>{{item.subtitle}}</span>
            </div>
            <div class="item-body">
              <h2><count-up :startVal="0" :endVal="item.count"></count-up></h2>
            </div>
            <div class="item-footer">
              <span>{{item.allCount}}</span>
              <p>{{item.text}}</p>
            </div>
            <p class="item-tip">{{item.key}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import CountUp from 'vue-count-to'
export default {
  name: 'MainCard',
  components: { CountUp },
  data () {
    return {
      span: this.option.span || 6,
      data: this.option.data || []
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
  .data-tabs {
    .item:hover {
      cursor: pointer;
    }
  }
</style>
