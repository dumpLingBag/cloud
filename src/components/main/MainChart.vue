<template>
    <div class="main-card">
      <div class="card-table">
        <el-row :gutter="15">
          <el-col :span="12">
            <div id="gradient" class="data-chart" style="width: 100%;height: 400px"></div>
          </el-col>
          <el-col :span="12">
            <div id="world" class="data-chart" style="width: 100%;height: 400px"></div>
          </el-col>
        </el-row>
      </div>
      <div class="card-table">
        <el-row :gutter="15">
          <el-col :span="12">
            <div id="polyline" class="data-chart" style="height: 400px"></div>
          </el-col>
          <el-col :span="12">
            <div id="waterfall" class="data-chart" style="height: 400px"></div>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'
export default {
  name: 'MainChart',
  data () {
    return {

    }
  },
  mounted () {
    this.gradient();
    this.world();
    this.polyline();
    this.waterfall()
  },
  methods: {
    gradient () {
      let grad = echarts.init(document.getElementById('gradient'), 'macarons');
      grad.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['利润', '支出', '收入']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        series: [
          {
            name: '利润',
            type: 'bar',
            itemStyle: { normal: { label: { show: true, position: 'inside' } } },
            data: [200, 170, 240, 244, 200, 220, 210]
          },
          {
            name: '收入',
            type: 'bar',
            stack: '总量',
            barWidth: 5,
            itemStyle: { normal: {
              label: { show: true }
            } },
            data: [320, 302, 341, 374, 390, 450, 420]
          },
          {
            name: '支出',
            type: 'bar',
            stack: '总量',
            itemStyle: { normal: {
              label: { show: true, position: 'left' }
            } },
            data: [-120, -132, -101, -134, -190, -230, -210]
          }
        ]
      })
    },
    world () {
      let world = echarts.init(document.getElementById('world'), 'macarons');
      world.setOption({
        title: {
          text: '世界人口总量',
          subtext: '数据来自网络'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2011年', '2012年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      })
    },
    polyline () {
      let poly = echarts.init(document.getElementById('polyline'), 'macarons');
      poly.setOption({
        title: {
          text: '未来一周气温变化',
          subtext: '数据来源自大自然'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高气温', '最低气温']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '最高气温',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '最低气温',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [
                { name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      })
    },
    waterfall () {
      let fall = echarts.init(document.getElementById('waterfall'), 'macarons');
      fall.setOption({
        title: {
          text: '阶梯瀑布图',
          subtext: 'From ExcelHome',
          sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var tar;
            if (params[1].value !== '-') {
              tar = params[1]
            } else {
              tar = params[0]
            }
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
          }
        },
        legend: {
          data: ['支出', '收入']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            splitLine: { show: false },
            data: (function () {
              var list = [];
              for (var i = 1; i <= 11; i++) {
                list.push('11月' + i + '日')
              }
              return list
            }())
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '辅助',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              },
              emphasis: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              }
            },
            data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
          },
          {
            name: '收入',
            type: 'bar',
            stack: '总量',
            itemStyle: { normal: { label: { show: true, position: 'top' } } },
            data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
          },
          {
            name: '支出',
            type: 'bar',
            stack: '总量',
            itemStyle: { normal: { label: { show: true, position: 'bottom' } } },
            data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
  .data-chart {
    background-color: #ffffff;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  }
</style>
