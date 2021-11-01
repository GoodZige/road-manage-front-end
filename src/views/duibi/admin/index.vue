
<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">总量统计</p>
          <el-row>
            <el-col
              :xs="24"
              :sm="24"
              :lg="6"
              class="btn-col"
              style="margin-left: 20px"
            >
              <el-date-picker
                v-model="dates.sumDate"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <a
                class="pan-btn blue-btn"
                style="line-height: 12px"
                @click="changeSumData"
                >总量对比</a
              >
            </el-col>
          </el-row>

          <div class="chart-wrapper">
            <sum-panel :init-data="sumData" />

            <haikangPanel :init-data="totalData" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">图片地址</p>

          <el-row>
            <el-col
              :xs="24"
              :sm="24"
              :lg="6"
              class="btn-col"
              style="margin-left: 20px"
            >
              <el-date-picker
                v-model="dates.beforeDate"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <a
                class="pan-btn blue-btn"
                style="line-height: 12px"
                @click="getPicture"
                >获取图片</a
              >
            </el-col>
          </el-row>

          <!-- <Kanban :list="list1" :group="group" class="kanban todo" header-text="图片地址" /> -->

          <!-- <div>
            <el-link
              v-for="item in items"
              type="info"
              href="item"
              target="_blank"
              >{{ item }}</el-link
            >
          </div> -->

          <template>
            <!-- data -->
            <el-table :data="currentData" border style="width: 100%">
              <el-table-column fixed prop="date" label="id号" width="150">
              </el-table-column>
              <el-table-column prop="address" label="地址" width="300">
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-link type="info" :href="scope.row.address" target="_blank"
                    >查看</el-link
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- pagetotal数组类型共多少页 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.length"
            >
            </el-pagination>
          </template></div></el-col
    ></el-row>
  </div>
</template>

 

    <!-- <el-row :gutter="32">
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
    </el-row> -->

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height:500px">
      <mix-chart :init-data="lastHoursData" height="500px" width="100%" :chart-data="lineChartData" />
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import SumPanel from "./components/SumPanel";
import haikangPanel from "./components/haikangPanel";
import PieChart from "./components/PieChart";
import MixChart from "./components/MixChart";
import { parseTime } from "@/utils";
import FilenameOption from "./components/FilenameOption";
import AutoWidthOption from "./components/AutoWidthOption";
import BookTypeOption from "./components/BookTypeOption";

import Kanban from "@/components/Kanban";

import {
  fetchAnalysis,
  fetchCountByHour,
  fetchAddress,
  fetchSumVolume,
  fetchHKSum,
  fetchMonthpicture,
  fetchhaikangVolume,
} from "@/api/road";
import { date } from "jszip/lib/defaults";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

// eslint-disable-next-line no-extend-native
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    PieChart,
    MixChart,
    FilenameOption,
    AutoWidthOption,
    BookTypeOption,
    SumPanel,
    haikangPanel,
    Kanban,
  },
  data() {
    return {
      sortedhao: 0,
      totalData: {},
      //当前页数据
      currentData: [],
      //初始页
      currentPage: 1,
      //每页数据数量
      pagesize: 10,
      //
      userList: [],
      tableData: [],
      lineChartData: lineChartData.newVisitis,
      allData: {},
      sumData: {},
      lastHoursData: [],
      addressOptions: [],
      roadOptions: [
        {
          LaneNo: "017",
          LaneNoName: "车道1",
        },
        {
          LaneNo: "018",
          LaneNoName: "车道2",
        },
        {
          LaneNo: "019",
          LaneNoName: "车道3",
        },
        {
          LaneNo: "020",
          LaneNoName: "车道4",
        },
      ],
      addressValue: "21091604",
      roadValue: "017",
      dates: {
        value2: null,
        sumDate: null,
      },
      partList: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: "",
        autoWidth: true,
        bookType: "xlsx",
      },
      allList: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: "",
        autoWidth: true,
        bookType: "xlsx",
      },
    };
  },
  computed: {
    currenceData() {
      let arr = Array();
      if (this.tableData.length > this.pagesize) {
        console.log("不应该进入这里");
        let len = Math.round(this.tableData.length / this.pagesize);
        for (let i = 0; i < len; i++) {
          console.log(
            this.tableData.slice(i * this.pagesize, (i + 1) * this.pagesize)
          );
          arr.push(
            this.tableData.slice(i * this.pagesize, (i + 1) * this.pagesize)
          );
        }
        let surplus = this.tableData.slice(
          len * this.pagesize,
          this.tableData.length
        );
        arr.push(surplus);
        console.log("arrzzz", arr);
      } else {
        console.log("应该进入这里");
        arr.push(this.tableData);
      }

      console.log("arr", arr);
      return arr;
    },

    // pagetotal(){
    //    let arr = []
    //    console.log('table.lenth',this.tableData.length)
    //    if(this.tableData.length >10){
    //       let len = Math.round(this.tableData.length/this.pagesize)
    //       console.log('after len:', this.tableData.length/this.pagesize)
    //       for(let i =0 ; i<len; i++){
    //         arr.push(this.pagesize)
    //       }
    //       let surplus = this.tableData.length - len*this.pagesize
    //       arr.push(surplus)
    //    }else{
    //      arr.push(this.tableData.length)
    //    }

    //    console.log('arr', arr)
    //    return arr
    // }
  },
  watch: {
    addressValue: function (newValue) {
      console.log(this.addressOptions.find((item) => item.value === newValue));
      this.roadOptions = this.addressOptions.find(
        (item) => item.value === newValue
      ).roadOptions;
    },
  },
  mounted() {
    var lastDate = new Date();

    var lastDate2 = new Date();

    console.log("lastDate", lastDate2);
    var tenMinDate = new Date();
    tenMinDate.setTime(tenMinDate.getTime() - 1000 * 60 * 10);

    //十分钟
    this.$set(this.dates, "beforeDate", [tenMinDate, lastDate2]);
    // lastDate.setDate(lastDate.getDate() - 1)

    lastDate.setHours(0);
    lastDate.setMinutes(0);
    lastDate.setSeconds(0);
    var nextDate = new Date();
    nextDate.setHours(23);
    nextDate.setMinutes(59);
    nextDate.setSeconds(59);

    this.$set(this.dates, "value2", [lastDate, nextDate]);

    this.$set(this.dates, "sumDate", [lastDate, nextDate]);

    this.$set(this.dates, "month", new Date());
    this.$set(this.dates, "date", new Date());

    var today = new Date();
    var myyear = today.getFullYear();
    var mymonth = today.getMonth() + 1;
    var myweekday = today.getDate();
    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    var strDay = myyear + "-" + mymonth + "-" + myweekday;
    var query1 = {
      LaneNo: `017`,
      CrossId: `21091604`,
      start: this.dates.value2[0].format("yyyy-MM-dd hh:mm:ss"),
      end: this.dates.value2[1].format("yyyy-MM-dd hh:mm:ss"),
      // hours: 2
    };
    var query2 = {
      date: strDay,
      LaneNo: `017`,
      CrossId: `21091604`,
      // hours: 2
    };
    fetchAnalysis(query1).then((response) => {
      console.log(response);
      this.allData = response.data;
    });
    fetchCountByHour(query2).then((response) => {
      this.lastHoursData = response.data;
      this.partList.list = response.data;
    });
    const sumQuery = {
      start: this.dates.sumDate[0].format("yyyy-MM-dd hh:mm:ss"),
      end: this.dates.sumDate[1].format("yyyy-MM-dd hh:mm:ss"),
    };
    this.initSumData(sumQuery);
    this.testHK();

    //挂载 图片地址
    console.log("图片");
    this.updateImage();

    this.getPicture();
  },
  created() {
    this.fetchData();
  },
  methods: {
    updateImage(page = 1) {
      let temp = this.currenceData;
      console.log("temp", temp);
      this.currentData = temp[page - 1];
      console.log("currentData", this.currentData);
    },

    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
      let temp = this.currenceData;
      console.log("temp", temp);
      this.currentData = temp[this.pagesize - 1];
      console.log("currentData", this.currentData);
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log("点击页面" + this.currentPage); //点击第几页
      let temp = this.currenceData;
      console.log("temp", temp);
      this.currentData = temp[this.currentPage - 1];
      console.log("currentData", this.currentData);
    },
    handleUserList() {
      this.$http.get("http://localhost:3000/userList").then((res) => {
        //这是从本地请求的数据接口，
        this.userList = res.body;
      });
    },

    handleClick(row) {
      console.log(row);
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    testHK() {
      console.log(this.dates.sumDate[0].format("yyyy-MM-ddThh:mm:ss.S"));
      const query = {
        bigData: {
          crossingIndexCode: "21091604",
          groupBy: "passTime",
          maxResults: "1000",
          passTime:
            this.dates.sumDate[0].format("yyyy-MM-ddThh:mm:ss.S") +
            "," +
            this.dates.sumDate[1].format("yyyy-MM-ddThh:mm:ss.S"),
          statsType: "terms",
          sort: "asc",
          passTimeType: "day",
          type: "vehiclepass",
        },
      };
      fetchHKSum(query).then((response) => {
        console.log(response);
      });
    },

    getPicture(query) {
      // const sumQuery = {
      //   startTime: this.dates.beforeDate[0].format("yyyy-MM-dd hh:mm:ss"),
      //   endTime: this.dates.beforeDate[1].format("yyyy-MM-dd hh:mm:ss"),
      // };
      const sumQuery = {
        startTime: "2021-10-29 15:15:54",
        endTime: "2021-10-29 15:25:54",
      };
      fetchMonthpicture(sumQuery).then(
        (response) => {
          console.log("图片数据:", response.data[0]["targetPicUrl"]);
          let len = response.data.length;
          var arr = [];
          for (let i = 0; i < len; i++) {
            let test = i + 1;
            arr.push({ date: test, address: response.data[i]["targetPicUrl"] });
          }
          console.log(arr);
          this.tableData = arr;
          this.updateImage();
        },
        (err) => {
          console.log("zzz", err);
        }
      );
    },
    //总数对比请求
    initSumData(query) {
      let startDate = this.dates.sumDate[0].getDate();
      let endDate = this.dates.sumDate[1].getDate();
      if (startDate <= 19 && endDate <= 19) {
        let theseDateSum = 0;
        console.log("进入请求");
        for (let i = startDate; i <= endDate; i++) {
          console.log("共显示天数：", i);
          theseDateSum = theseDateSum + this.monthData[i - 1].Volume;
        }
        console.log(theseDateSum);
        //前19天暂时设置这样
        this.sumData = theseDateSum;
        this.totalData = theseDateSum;
      } else {
        console.log("是否进入");
        var addDay = new Date("2021-10-01 00:00:00");
        //获取开始结束时间
        const sumQuery2 = {
          startTime: this.dates.sumDate[0].format("yyyy-MM-dd hh:mm:ss"),
          endTime: this.dates.sumDate[1].format("yyyy-MM-dd hh:mm:ss"),
        };
        //时间参数暂时不加
        console.log("sumQuery", sumQuery);

        //地磁总量请求 有参数sumQuery暂时不加
        const sumQuery = {
          start: this.dates.sumDate[0].format("yyyy-MM-dd hh:mm:ss"),
          end: this.dates.sumDate[1].format("yyyy-MM-dd hh:mm:ss"),
        };
        //地磁总量
        fetchSumVolume(sumQuery).then(
          (response) => {
            console.log("地磁数据", response);
            this.sumData = response.data[0];
          },
          (err) => {
            console.log(err);
          }
        );

        //海康总量请求
        fetchhaikangVolume(sumQuery2).then(
          (response) => {
            console.log("海康对比参数：", response.data[0]["count"]);

            this.totalData = { Volume: response.data[0]["count"], AvgSpeed: 0 };

            // console.log("pictureum：", response.data);
            // if (response.data.length > 0) {
            //   if (response.data[0] != null) {
            //     // if (addDay.getTime() > this.dates.sumDate[0]) {
            //     //   //获取数据
            //     //   this.sumData = response.data[0]["sum(Volume)"] + 30000;
            //     this.tableData.address = [...response.data];

            //     // } else {
            //     //   this.sumData = response.data[0]["sum(Volume)"];

            //     // }
            //   } else {
            //     this.sumData = 0;
            //   }
            // } else {
            //   this.sumData = 0;
            // }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    },
    changeSumData() {
      // const sumQuery = {
      //   start: this.dates.sumDate[0].format("yyyy-MM-dd hh:mm:ss"),
      //   end: this.dates.sumDate[1].format("yyyy-MM-dd hh:mm:ss"),
      // };
      // console.log(sumQuery);
      // this.initSumData(sumQuery);
      //无参数
      this.initSumData();
    },
    changeData() {
      const that = this;
      const query3 = {
        CrossId: that.addressValue,
        LaneNo: that.roadValue,
        start: that.dates.value2[0].format("yyyy-MM-dd hh:mm:ss"),
        end: that.dates.value2[1].format("yyyy-MM-dd hh:mm:ss"),
      };

      // query4
      var today = new Date();
      // today.setDate(today.getDate() - 6)
      var myyear = today.getFullYear();
      var mymonth = today.getMonth() + 1;
      var myweekday = today.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      var strDay = myyear + "-" + mymonth + "-" + myweekday;
      const query4 = {
        date: strDay,
        LaneNo: that.roadValue,
        CrossId: that.addressValue,
      };

      fetchAnalysis(query3).then((response) => {
        this.allData = response.data;
      });
      fetchCountByHour(query4).then((response) => {
        this.lastHoursData = response.data;
        this.partList.list = response.data;
      });
    },
    fetchData() {
      this.listLoading = true;
      var today = new Date();
      var myyear = today.getFullYear();
      var mymonth = today.getMonth() + 1;
      var myweekday = today.getDate();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      var strDay = myyear + "-" + mymonth + "-" + myweekday;
      var query2 = {
        date: strDay,
        LaneNo: this.value,
        // hours: 2
      };
      fetchCountByHour(query2).then((response) => {
        this.partList.list = response.data;
        this.partList.listLoading = false;
      });

      // 获取地点及车道列表
      // http://localhost:8099/message/getCrossLano
      fetchAddress().then((response) => {
        console.log("地点车道信息：", response.data);
        this.addressOptions = response.data.map((x) => {
          return { value: x.CrossId, label: x.CrossName, roadOptions: x.Lano };
        });
      });
    },
    handleSumDownload() {
      this.allList.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "路线",
          "平均车速",
          "进出车辆数目",
          "微小车辆数量",
          "小车数量",
          "中车数量",
          "大车数量",
          "超大车数量",
        ];
        const filterVal = [
          "CrossName",
          "AvgSpeed",
          "Volume",
          "Volume1",
          "Volume2",
          "Volume3",
          "Volume4",
          "Volume5",
        ];
        const list = this.allList.list;
        console.log("list");
        console.log(list);
        const data = this.formatJson(filterVal, list);
        console.log(data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.allList.filename,
          autoWidth: this.allList.autoWidth,
          bookType: this.allList.bookType,
        });
        this.allList.downloadLoading = false;
      });
    },
    handleDownload() {
      this.partList.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "平均车速",
          "进出车辆数目",
          "微小车辆数量",
          "小车数量",
          "中车数量",
          "大车数量",
          "超大车数量",
        ];
        const filterVal = [
          "AvgSpeed",
          "Volume",
          "Volume1",
          "Volume2",
          "Volume3",
          "Volume4",
          "Volume5",
        ];
        const list = this.partList.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.partList.filename,
          autoWidth: this.partList.autoWidth,
          bookType: this.partList.bookType,
        });
        this.partList.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
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
.choose-title {
  margin: 0 0 10px 14px;
  font-weight: bold;
  font-size: 14px;
  color: #606266;
}
.btn-col {
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
