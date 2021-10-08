<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">总量统计</p>
          <el-row>
            <el-col :xs="24" :sm="24" :lg="10" class="btn-col" style="margin-left:20px">
              <el-date-picker
                v-model="dates.sumDate"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <a class="pan-btn blue-btn" style="line-height:12px;" @click="changeSumData">切换</a>
            </el-col>
          </el-row>
          <div class="chart-wrapper">
            <sum-panel :init-data="sumData" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">选择车流量统计图日期</p>
          <el-row>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <el-date-picker
                v-model="dates.date"
                type="date"
                align="right"
                placeholder="选择月份"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="5" class="btn-col">
              <a class="pan-btn blue-btn" style="line-height:12px;" @click="changeDateData">切换</a>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height:550px">
      <mix-chart id='chart1' :init-data="lineData" height="500px" width="100%" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">选择车流量统计图月份</p>
          <el-row>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <el-date-picker
                v-model="dates.month"
                type="month"
                align="right"
                placeholder="选择月份"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="5" class="btn-col">
              <a class="pan-btn blue-btn" style="line-height:12px;" @click="changeMonthData">切换</a>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height:550px">
      <sec-mix-chart id='chart2' :init-data="monthData" height="500px" width="100%" />
    </el-row>
  </div>
</template>

<script>
import SumPanel from './components/SumPanel'
import MixChart from './components/MixChart'
import SecMixChart from './components/SecMixChart'

// import { parseTime } from '@/utils'

import { fetchSumVolume, fetchMonthVolume, fetchCountByHour } from '@/api/road'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

// eslint-disable-next-line no-extend-native
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export default {
  name: 'DashboardAdmin',
  components: {
    SumPanel,
    MixChart,
    SecMixChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      allData: {},
      sumData: {},
      lastHoursData: [],
      lineData: [],
      monthData: [],
      addressOptions: [],
      roadOptions: [
        {
          LaneNo: '017',
          LaneNoName: '车道1'
        },
        {
          LaneNo: '018',
          LaneNoName: '车道2'
        },
        {
          LaneNo: '019',
          LaneNoName: '车道3'
        },
        {
          LaneNo: '020',
          LaneNoName: '车道4'
        }
      ],
      addressValue: '21091604',
      roadValue: '017',
      dates: {
        value2: null,
        month: null,
        sumDate: null,
        date: null
      },
      partList: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx'
      },
      allList: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx'
      }
    }
  },
  watch: {
    addressValue: function(newValue) {
      console.log(this.addressOptions.find(item => item.value === newValue))
      this.roadOptions = this.addressOptions.find(item => item.value === newValue).roadOptions
    }
  },
  mounted() {
    var lastDate = new Date()
    // lastDate.setDate(lastDate.getDate() - 1)
    lastDate.setHours(0)
    lastDate.setMinutes(0)
    lastDate.setSeconds(0)
    var nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + 1)
    nextDate.setHours(0)
    nextDate.setMinutes(0)
    nextDate.setSeconds(0)
    this.$set(this.dates, 'value2', [lastDate, nextDate])
    this.$set(this.dates, 'sumDate', [lastDate, nextDate])
    this.$set(this.dates, 'month', new Date())
    this.$set(this.dates, 'date', new Date())

    this.initSumData()

    const query = {
      month: this.dates.month.format('yyyy-MM')
    }
    fetchMonthVolume(query).then(response => {
      console.log('monthData：', response.data)
      this.monthData = response.data
    })

    // http://localhost:8100/message/countByHour?date=2021-10-08
    const queryLineChart = {
      date: this.dates.date.format('yyyy-MM-dd')
    }
    fetchCountByHour(queryLineChart).then(response => {
      console.log('lineData：', response.data)
      this.lineData = response.data
    })
  },
  created() {

  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    initSumData() {
      var addDay = new Date('2021-10-01 00:00:00')
      const sumQuery = {
        start: this.dates.sumDate[0].format('yyyy-MM-dd hh:mm:ss'),
        end: this.dates.sumDate[1].format('yyyy-MM-dd hh:mm:ss')
      }
      fetchSumVolume(sumQuery).then(response => {
        console.log('sum：', response.data)
        if (response.data.length > 0) {
          if (response.data[0] != null) {
            if (addDay.getTime() > this.dates.sumDate[0]) {
              this.sumData = response.data[0]['sum(Volume)'] + 30000
            } else {
              this.sumData = response.data[0]['sum(Volume)']
            }
          } else {
            this.sumData = 0
          }
        } else {
          this.sumData = 0
        }
      })
    },
    changeSumData() {
      this.initSumData()
    },
    changeDateData() {
      const query = {
        month: this.dates.date.format('yyyy-MM-dd')
      }
      fetchMonthVolume(query).then(response => {
        console.log('dateData：', response.data)
        this.lineData = response.data
      })
    },
    changeMonthData() {
      const query = {
        month: this.dates.month.format('yyyy-MM')
      }
      fetchMonthVolume(query).then(response => {
        console.log('monthData：', response.data)
        this.monthData = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .input-wrapper {
    background: #fff;
    padding: 16px 16px 16px;
    margin-bottom: 32px;
  }
}
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
.choose-title{
  margin: 0 0 10px 14px;
  font-weight: bold;
  font-size: 14px;
  color: #606266;
}
.btn-col{
  padding: 10px 0;
  display: flex;
  align-items:center;
  justify-content:center;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
