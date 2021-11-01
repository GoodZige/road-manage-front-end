<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">总量统计</p>
          <el-row>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col" style="margin-left:20px">
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
          <div>
            <FilenameOption v-model="allList.filename" />
            <AutoWidthOption v-model="allList.autoWidth" />
            <BookTypeOption v-model="allList.bookType" />
            <el-button :loading="allList.downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleSumDownload">
              导出2表格
            </el-button>
          </div>
          <el-table v-loading="allList.listLoading" :data="allList.list" element-loading-text="Loading..." border fit highlight-current-row>
            <el-table-column label="路线">
              <template slot-scope="scope">
                {{ scope.row.CrossName }}
              </template>
            </el-table-column>
            <el-table-column label="平均速度">
              <template slot-scope="scope">
                {{ scope.row.AvgSpeed }}
              </template>
            </el-table-column>
            <el-table-column label="进出车辆数目">
              <template slot-scope="scope">
                {{ scope.row.Volume }}
              </template>
            </el-table-column>
            <el-table-column label="微小车辆数量">
              <template slot-scope="scope">
                {{ scope.row.Volume1 }}
              </template>
            </el-table-column>
            <el-table-column label="小车数量">
              <template slot-scope="scope">
                {{ scope.row.Volume2 }}
              </template>
            </el-table-column>
            <el-table-column label="中车数量">
              <template slot-scope="scope">
                {{ scope.row.Volume3 }}
              </template>
            </el-table-column>
            <el-table-column label="大车数量">
              <template slot-scope="scope">
                {{ scope.row.Volume4 }}
              </template>
            </el-table-column>
            <el-table-column label="超大车数量">
              <template slot-scope="scope">
                {{ scope.row.Volume5 }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">区间选择</p>
          <el-row>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <el-select v-model="addressValue" placeholder="请选择地点">
                <el-option
                  v-for="item in addressOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <el-select v-model="roadValue" placeholder="请选择车道号">
                <el-option
                  v-for="item in roadOptions"
                  :key="item.LaneNo"
                  :label="item.LaneNoName"
                  :value="item.LaneNo"
                />
              </el-select>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <el-date-picker
                v-model="dates.value2"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="5" class="btn-col">
              <a class="pan-btn blue-btn" style="line-height:12px;" @click="changeData">切换</a>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <panel-group :init-data="allData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :init-data="allData" />
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height:500px">
      <mix-chart :init-data="lastHoursData" height="500px" width="100%" :chart-data="lineChartData" />
    </el-row>

    <el-row>
      <div>
        <FilenameOption v-model="partList.filename" />
        <AutoWidthOption v-model="partList.autoWidth" />
        <BookTypeOption v-model="partList.bookType" />
        <el-button :loading="partList.downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
          导出表格
        </el-button>
      </div>
      <el-table v-loading="partList.listLoading" :data="partList.list" element-loading-text="Loading..." border fit highlight-current-row>
        <el-table-column align="center" label="Id" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column label="平均车速">
          <template slot-scope="scope">
            {{ scope.row.AvgSpeed }}
          </template>
        </el-table-column>
        <el-table-column label="进出车辆数目">
          <template slot-scope="scope">
            {{ scope.row.Volume }}
          </template>
        </el-table-column>
        <el-table-column label="微小车辆数量">
          <template slot-scope="scope">
            {{ scope.row.Volume1 }}
          </template>
        </el-table-column>
        <el-table-column label="小车数量">
          <template slot-scope="scope">
            {{ scope.row.Volume2 }}
          </template>
        </el-table-column>
        <el-table-column label="中车数量">
          <template slot-scope="scope">
            {{ scope.row.Volume3 }}
          </template>
        </el-table-column>
        <el-table-column label="大车数量">
          <template slot-scope="scope">
            {{ scope.row.Volume4 }}
          </template>
        </el-table-column>
        <el-table-column label="超大车数量">
          <template slot-scope="scope">
            {{ scope.row.Volume5 }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import SumPanel from './components/SumPanel'
import PieChart from './components/PieChart'
import MixChart from './components/MixChart'
import { parseTime } from '@/utils'
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'

import { fetchAnalysis, fetchCountByHour, fetchAddress, fetchSumVolume, fetchHKSum } from '@/api/road'

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
    PanelGroup,
    PieChart,
    MixChart,
    FilenameOption,
    AutoWidthOption,
    BookTypeOption,
    SumPanel
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      allData: {},
      sumData: {},
      lastHoursData: [],
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
        sumDate: null
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
    lastDate.setDate(lastDate.getDate() - 1)
    this.$set(this.dates, 'value2', [lastDate, new Date()])
    this.$set(this.dates, 'sumDate', [lastDate, new Date()])
    var today = new Date()
    var myyear = today.getFullYear()
    var mymonth = today.getMonth() + 1
    var myweekday = today.getDate()
    if (mymonth < 10) {
      mymonth = '0' + mymonth
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday
    }
    var strDay = myyear + '-' + mymonth + '-' + myweekday
    var query1 = {
      LaneNo: `017`,
      CrossId: `21091604`,
      start: this.dates.value2[0].format('yyyy-MM-dd hh:mm:ss'),
      end: this.dates.value2[1].format('yyyy-MM-dd hh:mm:ss')
      // hours: 2
    }
    var query2 = {
      date: strDay,
      LaneNo: `017`,
      CrossId: `21091604`
      // hours: 2
    }
    fetchAnalysis(query1).then(response => {
      console.log(response)
      this.allData = response.data
    })
    fetchCountByHour(query2).then(response => {
      this.lastHoursData = response.data
      this.partList.list = response.data
    })
    const sumQuery = {
      start: this.dates.sumDate[0].format('yyyy-MM-dd hh:mm:ss'),
      end: this.dates.sumDate[1].format('yyyy-MM-dd hh:mm:ss')
    }
    this.initSumData(sumQuery)
    this.testHK()
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    testHK() {
      console.log(this.dates.sumDate[0].format('yyyy-MM-ddThh:mm:ss.S'))
      const query = {
        'bigData': {
          'crossingIndexCode': '21091604',
          'groupBy': 'passTime',
          'maxResults': '1000',
          'passTime': this.dates.sumDate[0].format('yyyy-MM-ddThh:mm:ss.S') + ',' + this.dates.sumDate[1].format('yyyy-MM-ddThh:mm:ss.S'),
          'statsType': 'terms',
          'sort': 'asc',
          'passTimeType': 'day',
          'type': 'vehiclepass'
        }
      }
      fetchHKSum(query).then(response => {
        console.log(response)
      })
    },
    initSumData(query) {
      function countTotal(arr, keyName) {
        let $total = 0
        $total = arr.reduce(function(total, currentValue, currentIndex, arr) {
          return currentValue[keyName] ? (total + currentValue[keyName]) : total
        }, 0)
        return $total
      }
      fetchSumVolume(query).then(response => {
        console.log('sum：', response.data)
        this.allList.list = response.data
        this.allList.listLoading = false
        this.sumData = {
          Volume: countTotal(this.allList.list, 'Volume'),
          AvgSpeed: countTotal(this.allList.list, 'AvgSpeed') / this.allList.list.length
        }
      })
    },
    changeSumData() {
      const sumQuery = {
        start: this.dates.sumDate[0].format('yyyy-MM-dd hh:mm:ss'),
        end: this.dates.sumDate[1].format('yyyy-MM-dd hh:mm:ss')
      }
      console.log(sumQuery)
      this.initSumData(sumQuery)
    },
    changeData() {
      const that = this
      const query3 = {
        CrossId: that.addressValue,
        LaneNo: that.roadValue,
        start: that.dates.value2[0].format('yyyy-MM-dd hh:mm:ss'),
        end: that.dates.value2[1].format('yyyy-MM-dd hh:mm:ss')
      }

      // query4
      var today = new Date()
      // today.setDate(today.getDate() - 6)
      var myyear = today.getFullYear()
      var mymonth = today.getMonth() + 1
      var myweekday = today.getDate()
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      var strDay = myyear + '-' + mymonth + '-' + myweekday
      const query4 = {
        date: strDay,
        LaneNo: that.roadValue,
        CrossId: that.addressValue
      }

      fetchAnalysis(query3).then(response => {
        this.allData = response.data
      })
      fetchCountByHour(query4).then(response => {
        this.lastHoursData = response.data
        this.partList.list = response.data
      })
    },
    fetchData() {
      this.listLoading = true
      var today = new Date()
      var myyear = today.getFullYear()
      var mymonth = today.getMonth() + 1
      var myweekday = today.getDate()
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      var strDay = myyear + '-' + mymonth + '-' + myweekday
      var query2 = {
        date: strDay,
        LaneNo: this.value
        // hours: 2
      }
      fetchCountByHour(query2).then(response => {
        this.partList.list = response.data
        this.partList.listLoading = false
      })

      // 获取地点及车道列表
      // http://localhost:8099/message/getCrossLano
      fetchAddress().then(response => {
        console.log('地点车道信息：', response.data)
        this.addressOptions = response.data.map(x => {
          return { 'value': x.CrossId, 'label': x.CrossName,
            roadOptions: x.Lano
          }
        })
      })
    },
    handleSumDownload() {
      this.allList.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['路线', '平均车速', '进出车辆数目', '微小车辆数量', '小车数量', '中车数量', '大车数量', '超大车数量']
        const filterVal = ['CrossName', 'AvgSpeed', 'Volume', 'Volume1', 'Volume2', 'Volume3', 'Volume4', 'Volume5']
        const list = this.allList.list
        console.log('list')
        console.log(list)
        const data = this.formatJson(filterVal, list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.allList.filename,
          autoWidth: this.allList.autoWidth,
          bookType: this.allList.bookType
        })
        this.allList.downloadLoading = false
      })
    },
    handleDownload() {
      this.partList.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['平均车速', '进出车辆数目', '微小车辆数量', '小车数量', '中车数量', '大车数量', '超大车数量']
        const filterVal = ['AvgSpeed', 'Volume', 'Volume1', 'Volume2', 'Volume3', 'Volume4', 'Volume5']
        const list = this.partList.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.partList.filename,
          autoWidth: this.partList.autoWidth,
          bookType: this.partList.bookType
        })
        this.partList.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
