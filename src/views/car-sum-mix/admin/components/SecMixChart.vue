<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    initData: {
      type: Object,
      default: null
    }
  },
  watch: {
    initData: function(newValue) {
      console.log(newValue)
      this.chartData = newValue.data
      let year = newValue.year
      let month = newValue.month
      console.log('chartData', this.chartData)
      // const xData = (function() {
      //   const data = []
      //   for (let i = 1; i < 31; i++) {
      //     data.push(i)
      //   }
      //   return data
      // }())
      let xData = null
      console.log(year,month);
      
      xData = this.chartData.map(x => { return x.date })
      
      let crossNameList = newValue.crossNameList
      let legendData = []
      legendData.push("各车道总量")
      crossNameList.forEach(element => {
        legendData.push(element)
      });
      this.chart.clear();
      this.chart.setOption({
        backgroundColor: 'rgb(159, 228, 227)',
        title: {
          text: '该月车流量统计',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: legendData,
          selected: (()=>{
            let obj = {
              '各车道总量': true
            }
            crossNameList.forEach(element => {
              obj[element] = false
            });
            return obj
          })()
          // selected: {
          //   '各车道总量': true
          // }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: true
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }],
        series: (()=>{
          let seriesList = []
          crossNameList.forEach(crossName => {
            function randomColor() {
              var col = "#";
              for (var i = 0; i < 6; i++) col+=parseInt(Math.random() * 16).toString(16);
              return col;
            }
            let thisColor = randomColor()
            let ss = {
              name: crossName,
              type: 'line',
              barMaxWidth: 35,
              barGap: '10%',
              itemStyle: {
                normal: {
                  color: thisColor,
                  label: {
                    show: true,
                    textStyle: {
                      color: '#fff'
                    },
                    position: 'insideTop',
                    formatter(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: (()=>{
                let sumData = []
                // if (year==2021 && month==10) {
                //   for(let i=0;i<18;i++){
                //     sumData.push(0)
                //   }
                //   let addData = this.chartData.map(x => { return x[crossName] })
                //   addData.forEach(element => {
                //     sumData.push(element)
                //   });
                // }else{
                sumData = this.chartData.map(x => { return x[crossName] })
                // }
                return sumData
              })()
            }
            seriesList.push(ss)
          });
          let sumSeries = {
            name: "各车道总量",
            type: 'bar',
            barMaxWidth: 35,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: 'rgba(255,144,128,1)',
                label: {
                  show: true,
                  textStyle: {
                    color: '#fff'
                  },
                  position: 'insideTop',
                  formatter(p) {
                    return p.value > 0 ? p.value : ''
                  }
                }
              }
            },
            data: (()=>{
              return this.chartData.map(x => {
                let sum = 0
                crossNameList.forEach(element => {
                  if (element in x) {
                    sum += x[element]
                  }
                });
                return sum
              })
              // if (year==2021 && month==10) {
              //   let staticSum =[45555,33027,84474,29211,27867,36174,28527,26235,66493,
              //   58055,68978,59972,52647,79668,58895,64563,56256,87654]
              //   let addSum = this.chartData.map(x => {
              //     let sum = 0
              //     crossNameList.forEach(element => {
              //       if (element in x) {
              //         sum += x[element]
              //       }
              //     });
              //     return sum
              //   })
              //   addSum.forEach(element => {
              //     staticSum.push(element)
              //   });
              //   return staticSum
              // }else{
              //   return this.chartData.map(x => {
              //     let sum = 0
              //     crossNameList.forEach(element => {
              //       if (element in x) {
              //         sum += x[element]
              //       }
              //     });
              //     return sum
              //   })
              // }
            })(),
          }
          seriesList.push(sumSeries)
          return seriesList
        })(),
        // series: [{
        //   name: '车流量',
        //   type: 'bar',
        //   stack: 'total',
        //   barMaxWidth: 35,
        //   barGap: '10%',
        //   itemStyle: {
        //     normal: {
        //       color: 'rgba(255,144,128,1)',
        //       label: {
        //         show: true,
        //         textStyle: {
        //           color: '#fff'
        //         },
        //         position: 'insideTop',
        //         formatter(p) {
        //           return p.value > 0 ? p.value : ''
        //         }
        //       }
        //     }
        //   },
        //   data: this.chartData.map(x => { return x.Volume })
        // }
        // ]
      })
    }
  },
  data() {
    return {
      chart: null,
      chartData: []
    }
  },
  mounted() {
    this.initChart()
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
      this.chart = echarts.init(document.getElementById(this.id))
      // const xData = (function() {
      //   const data = []
      //   for (let i = 1; i < 13; i++) {
      //     data.push(i + 'month')
      //   }
      //   return data
      // }())
      // this.chart.setOption({
      //   backgroundColor: '#344b58',
      //   title: {
      //     text: '近24小时车辆数据',
      //     x: '20',
      //     top: '20',
      //     textStyle: {
      //       color: '#fff',
      //       fontSize: '22'
      //     },
      //     subtextStyle: {
      //       color: '#90979c',
      //       fontSize: '16'
      //     }
      //   },
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       textStyle: {
      //         color: '#fff'
      //       }
      //     }
      //   },
      //   grid: {
      //     left: '5%',
      //     right: '5%',
      //     borderWidth: 0,
      //     top: 150,
      //     bottom: 95,
      //     textStyle: {
      //       color: '#fff'
      //     }
      //   },
      //   legend: {
      //     x: '5%',
      //     top: '10%',
      //     textStyle: {
      //       color: '#90979c'
      //     },
      //     data: ['female', 'male', 'average']
      //   },
      //   calculable: true,
      //   xAxis: [{
      //     type: 'category',
      //     axisLine: {
      //       lineStyle: {
      //         color: '#90979c'
      //       }
      //     },
      //     splitLine: {
      //       show: false
      //     },
      //     axisTick: {
      //       show: false
      //     },
      //     splitArea: {
      //       show: false
      //     },
      //     axisLabel: {
      //       interval: 0

      //     },
      //     data: xData
      //   }],
      //   yAxis: [{
      //     type: 'value',
      //     splitLine: {
      //       show: false
      //     },
      //     axisLine: {
      //       lineStyle: {
      //         color: '#90979c'
      //       }
      //     },
      //     axisTick: {
      //       show: false
      //     },
      //     axisLabel: {
      //       interval: 0
      //     },
      //     splitArea: {
      //       show: false
      //     }
      //   }],
      //   dataZoom: [{
      //     show: true,
      //     height: 30,
      //     xAxisIndex: [
      //       0
      //     ],
      //     bottom: 30,
      //     start: 10,
      //     end: 80,
      //     handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      //     handleSize: '110%',
      //     handleStyle: {
      //       color: '#d3dee5'

      //     },
      //     textStyle: {
      //       color: '#fff' },
      //     borderColor: '#90979c'

      //   }, {
      //     type: 'inside',
      //     show: true,
      //     height: 15,
      //     start: 1,
      //     end: 35
      //   }],
      //   series: [{
      //     name: 'female',
      //     type: 'bar',
      //     stack: 'total',
      //     barMaxWidth: 35,
      //     barGap: '10%',
      //     itemStyle: {
      //       normal: {
      //         color: 'rgba(255,144,128,1)',
      //         label: {
      //           show: true,
      //           textStyle: {
      //             color: '#fff'
      //           },
      //           position: 'insideTop',
      //           formatter(p) {
      //             return p.value > 0 ? p.value : ''
      //           }
      //         }
      //       }
      //     },
      //     data: [
      //       709,
      //       1917,
      //       2455,
      //       2610,
      //       1719,
      //       1433,
      //       1544,
      //       3285,
      //       5208,
      //       3372,
      //       2484,
      //       4078
      //     ]
      //   },

      //   {
      //     name: 'male',
      //     type: 'bar',
      //     stack: 'total',
      //     itemStyle: {
      //       normal: {
      //         color: 'rgba(0,191,183,1)',
      //         barBorderRadius: 0,
      //         label: {
      //           show: true,
      //           position: 'top',
      //           formatter(p) {
      //             return p.value > 0 ? p.value : ''
      //           }
      //         }
      //       }
      //     },
      //     data: [
      //       327,
      //       1776,
      //       507,
      //       1200,
      //       800,
      //       482,
      //       204,
      //       1390,
      //       1001,
      //       951,
      //       381,
      //       220
      //     ]
      //   }, {
      //     name: 'average',
      //     type: 'line',
      //     stack: 'total',
      //     symbolSize: 10,
      //     symbol: 'circle',
      //     itemStyle: {
      //       normal: {
      //         color: 'rgba(252,230,48,1)',
      //         barBorderRadius: 0,
      //         label: {
      //           show: true,
      //           position: 'top',
      //           formatter(p) {
      //             return p.value > 0 ? p.value : ''
      //           }
      //         }
      //       }
      //     },
      //     data: [
      //       1036,
      //       3693,
      //       2962,
      //       3810,
      //       2519,
      //       1915,
      //       1748,
      //       4675,
      //       6209,
      //       4323,
      //       2865,
      //       4298
      //     ]
      //   }
      //   ]
      // })
    }
  }
}
</script>
