<template>
    <div class="data-tabs card-table">
      <el-row>
        <el-col :span="span" v-for="(item, index) in data" :key="index">
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
    background-color: #ffffff;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    .item:hover {
      cursor: pointer;
    }
  }
</style>
