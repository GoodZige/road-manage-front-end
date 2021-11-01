<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    initData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      usedData: null
    }
  },
  watch: {
    initData: function(newVal, oldVal) {
      if (newVal != null) {
        this.usedData = newVal
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['微小车辆数量', '小车数量', '中车数量', '大车数量', '超大车数量']
          },
          series: [
            {
              name: '车辆类型',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: [
                { value: newVal.Volume1, name: '微小车辆数量' },
                { value: newVal.Volume2, name: '小车数量' },
                { value: newVal.Volume3, name: '中车数量' },
                { value: newVal.Volume4, name: '大车数量' },
                { value: newVal.Volume5, name: '超大车数量' }
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['微小车辆数量', '小车数量', '中车数量', '大车数量', '超大车数量']
        },
        series: [
          {
            name: '车辆类型',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 0, name: '微小车辆数量' },
              { value: 0, name: '小车数量' },
              { value: 0, name: '中车数量' },
              { value: 0, name: '大车数量' },
              { value: 0, name: '超大车数量' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
