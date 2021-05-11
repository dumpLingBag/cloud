<template>
    <div class="data-tabs card-table">
        <el-row :gutter="20">
            <el-col class="p-mb" :lg="6" :sm="24" v-for="(item, index) in data" :key="index">
                <div class="p-card">
                    <div class="p-card-head">
                        <p>{{item.title}}</p>
                    </div>
                    <div class="p-card-extra">
                        <el-tag size="small" :type="item.type">{{ item.key }}</el-tag>
                    </div>
                    <div class="p-card-body" style="padding: 12px">
                        <div>
                            <p style="font-size: 30px"><count-up :startVal="0" :endVal="item.count"></count-up></p>
                            <div class="p-pt-8" style="height: 42px"></div>
                            <el-divider></el-divider>
                        </div>
                        <div>
                            <div class="el-row">
                                <el-col :span="12">{{item.text}}</el-col>
                                <el-col class="el-text-right" :span="12"><count-up :startVal="0" :endVal="item.allCount"></count-up></el-col>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="p-card">
            <div class="p-card-head">
                <div>
                    <div class="el-row">
                        <div class="el-col-8">
                            <el-avatar style="vertical-align: middle;color: rgb(24, 144, 255);background-color: rgb(230, 247, 255);" shape="circle" size="small" icon="el-icon-s-data"></el-avatar>
                            <span class="el-pl-8">访问量</span>
                        </div>
                        <div class="el-col-16">

                        </div>
                    </div>
                </div>
            </div>
            <div class="p-card-body" style="padding: 12px">
                <div>
                    <div class="el-row">
                        <div class="el-col-16">
                            <div id="zoom" style="width: 100%;height: 260px"></div>
                        </div>
                        <div class="el-col-8">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CountUp from 'vue-count-to'
import macarons from '@/utils/macarons'
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar'//柱状图
import 'echarts/lib/chart/line'//线型图
import 'echarts/lib/chart/pie'//饼图
import 'echarts/lib/component/title'//图表标题
import 'echarts/lib/component/dataZoom'//dataZoom组件
import 'echarts/lib/component/tooltip'//tooltip
import 'echarts/lib/component/legend'//图例
import 'echarts/lib/component/toolbox'//图例
import 'echarts/lib/component/grid'//图例
import 'echarts/lib/component/polar'//图例
import 'echarts/lib/component/timeline'//图例
import 'echarts/lib/component/visualMap'//图例
export default {
    name: 'MainCard',
    components: {CountUp},
    data() {
        return {
            span: this.option.span || 6,
            data: this.option.data || []
        }
    },
    props: {
        option: {
            type: Object,
            default: () => {
            }
        }
    },
    mounted() {
        this.zoomEcharts()
    },
    methods: {
        zoomEcharts() {
            this.zmEcharts = echarts.init(document.getElementById('zoom'), macarons)
            let dataAxis = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 260];
            let yMax = 500;
            let dataShadow = [];

            for (let i = 0; i < data.length; i++) {
                dataShadow.push(yMax);
            }

            let option = {
                grid: {
                    left: '5%',
                    right: '2%',
                    top: 20,
                    bottom: 20,
                    show: true,
                    backgroundColor: 'transparent',
                    borderColor: '#fff'
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        inside: false,
                        textStyle: {
                            color: '#808695'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#DCDFE6'
                        }
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#808695'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#f8f8f8'
                        }
                    },
                    splitArea: {
                        show: false
                    }
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        showBackground: false,
                        itemStyle: {
                            borderRadius: [3, 3, 0, 0],
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#64c9ff'},
                                    {offset: 1, color: '#2f83ef'}
                                ]
                            )
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2f83ef'},
                                        {offset: 1, color: '#64c9ff'}
                                    ]
                                )
                            }
                        },
                        data: data
                    }
                ]
            };
            this.zmEcharts.setOption(option)
        }
    }
}
</script>

<style lang="scss">
.data-tabs {
  .item:hover {
    cursor: pointer;
  }

  .p-mb {
    margin-bottom: 16px;
  }

  .p-card {
    display: block;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    position: relative;
    transition: all .2s ease-in-out;
  }

  .p-card-head {
    border-bottom: 1px solid #e8eaec;
    padding: 14px 16px;
    line-height: 1;
    p {
      display: inline-block;
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      color: #17233d;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .p-card-extra {
    position: absolute;
    right: 16px;
    top: 14px;
  }
  .p-pt-8 {
    margin-top: 8px;
  }
  .p-card-body {
    .el-divider--horizontal {
      margin: 8px 0;
    }
    .el-col {
      padding: 0!important;
    }
    .el-text-right {
      text-align: right;
    }
    .el-divider--horizontal {
      background-color: #e8eaec;
    }
  }
}
</style>
