
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
            <!-- <haikangPanel :init-data="totalData" /> -->
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

const cross = [
  { Volume: 45555, date: "1" },
  { Volume: 33027, date: "2" },
  { Volume: 84474, date: "3" },
  { Volume: 29211, date: "4" },
  { Volume: 27867, date: "5" },
  { Volume: 36174, date: "6" },
  { Volume: 28527, date: "7" },
  { Volume: 26235, date: "8" },
  { Volume: 66493, date: "9" },
  { Volume: 58055, date: "10" },
  { Volume: 68978, date: "11" },
  { Volume: 59972, date: "12" },
  { Volume: 52647, date: "13" },
  { Volume: 79668, date: "14" },
  { Volume: 58895, date: "15" },
  { Volume: 64563, date: "16" },
  { Volume: 56256, date: "17" },
  { Volume: 87654, date: "18" },
  { Volume: 68789, date: "19" },
  { Volume: 0, date: "20" },
  { Volume: 0, date: "21" },
  { Volume: 0, date: "22" },
  { Volume: 0, date: "23" },
  { Volume: 0, date: "24" },
  { Volume: 0, date: "25" },
  { Volume: 0, date: "26" },
  { Volume: 0, date: "27" },
  { Volume: 0, date: "28" },
  { Volume: 0, date: "29" },
  { Volume: 0, date: "30" },
  { Volume: 0, date: "31" },
];

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
      monthData: [
        { Volume: 45555, date: "1" },
        { Volume: 33027, date: "2" },
        { Volume: 84474, date: "3" },
        { Volume: 29211, date: "4" },
        { Volume: 27867, date: "5" },
        { Volume: 36174, date: "6" },
        { Volume: 28527, date: "7" },
        { Volume: 26235, date: "8" },
        { Volume: 66493, date: "9" },
        { Volume: 58055, date: "10" },
        { Volume: 68978, date: "11" },
        { Volume: 59972, date: "12" },
        { Volume: 52647, date: "13" },
        { Volume: 79668, date: "14" },
        { Volume: 58895, date: "15" },
        { Volume: 64563, date: "16" },
        { Volume: 56256, date: "17" },
        { Volume: 87654, date: "18" },
        { Volume: 68789, date: "19" },
        { Volume: 0, date: "20" },
        { Volume: 0, date: "21" },
        { Volume: 0, date: "22" },
        { Volume: 0, date: "23" },
        { Volume: 0, date: "24" },
        { Volume: 0, date: "25" },
        { Volume: 0, date: "26" },
        { Volume: 0, date: "27" },
        { Volume: 0, date: "28" },
        { Volume: 0, date: "29" },
        { Volume: 0, date: "30" },
        { Volume: 0, date: "31" },
      ],
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

    const sumQuery = {
      start: this.dates.sumDate[0].format("yyyy-MM-dd hh:mm:ss"),
      end: this.dates.sumDate[1].format("yyyy-MM-dd hh:mm:ss"),
    };
    this.initSumData(sumQuery);

    //挂载 图片地址
    console.log("图片");
    this.updateImage();

    this.getPicture();
  },
  created() {},
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
      let actu_start = this.dates.sumDate[0].format("yyyy-MM-dd hh:mm:ss");
      let actu_end = this.dates.sumDate[1].format("yyyy-MM-dd hh:mm:ss");

      let startDate = this.dates.sumDate[0].getDate();
      let endDate = this.dates.sumDate[1].getDate();
      let startyear = this.dates.sumDate[0].getFullYear();
      let endyear = this.dates.sumDate[1].getFullYear();
      let startmoth = this.dates.sumDate[0].getMonth();
      let endmoth = this.dates.sumDate[1].getMonth();

      let startTime = this.dates.sumDate[0].getTime();
      let endTime = this.dates.sumDate[1].getTime();

      const start = new Date("2021-10-1 00:00:00").getTime();
      const end = new Date("2021-10-19 23:59:59").getTime();
      
      //开始结束都在10月1号到10月19号之内
      if (
        startyear == 2021 &&
        endyear == 2021 &&
        startmoth == 9 &&
        endmoth == 9 &&
        startDate <= 19 &&
        endDate <= 19
      ) {
        //获取地磁静态数据
        let theseDateSum = 0;
        console.log("进入静态");
        for (let i = startDate; i <= endDate; i++) {
          console.log("共显示天数：", i);
          theseDateSum = theseDateSum + cross[i - 1].Volume;
        }
        console.log(theseDateSum);
        //前19天暂时设置这样
        this.sumData = theseDateSum;
        //开始在10月1日之前  结束在10月19号之内
      } else if (startTime < start && start < endTime && endTime < end) {
        console.log("startDate22", startDate);
        console.log("endDate", endDate);
        //获取部分静态数据
        let theseDateSum = 0;
        for (let i = 1; i <= endDate; i++) {
          console.log("共显示天数：", i);
          theseDateSum = theseDateSum + cross[i - 1].Volume;
        }
        //地磁总量请求 有参数sumQuery暂时不加
        let endDay = new Date("2021-9-30 23:59:59").format("yyyy-MM-dd hh:mm:ss");
        const sumQuery = {
          start: actu_start,
          end: endDay,
        };
        //地磁总量
        fetchSumVolume(sumQuery).then(
          (response) => {
            console.log("地磁数据", response);
            if (response.data.length == 0) {
              this.sumData = theseDateSum;
            } else {
              this.sumData = theseDateSum + response.data[0]['sum(Volume)'];
            }
          },
          (err) => {
            console.log(err);
          }
        );

        //开始在10月1号到10月19号之内，结束在10月19号之后
      } else if (start <= startTime && startTime <= end && end < endTime) {
        console.log("是否进入hou");
        let theseDateSum = 0;
        for (let i = startDate; i <= 19; i++) {
          console.log("共显示天数：", i);
          theseDateSum = theseDateSum + cross[i - 1].Volume;
        }
        //地磁总量
        let startDay = new Date("2021-10-20 00:00:00").format("yyyy-MM-dd hh:mm:ss");
        const sumQuery = {
          start: startDay,
          end: actu_end,
        };
        fetchSumVolume(sumQuery).then(
          (response) => {
            console.log("地磁数据", response);
            if (response.data.length == 0) {
              this.sumData = theseDateSum;
            } else {
              this.sumData = theseDateSum + response.data[0]['sum(Volume)'];
            }
          },
          (err) => {
            console.log(err);
          }
        );
        //数据段包括静态数据 10月1日到10月19日
      } else if (startTime < start && end < endTime) {
        console.log("包括静态数据");
        let theseDateSum = 0;
        for (let i = 1; i <= 19; i++) {
          console.log("共显示天数：", i);
          theseDateSum = theseDateSum + cross[i - 1].Volume;
        }
        let startDay = new Date("2021-10-20 00:00:00").format("yyyy-MM-dd hh:mm:ss");
        let endDay = new Date("2021-9-30 23:59:59").format("yyyy-MM-dd hh:mm:ss");
        const sumQuery1 = {
          start: startDay,
          end: actu_end,
        };
        const sumQuery2 = {
          start: actu_start,
          end: endDay,
        };
        fetchSumVolume(sumQuery1).then(
          (response) => {
            console.log("地磁数据", response);
            if (response.data.length == 0) {
              // this.sumData = theseDateSum;
            } else {
              theseDateSum = theseDateSum + response.data[0]['sum(Volume)'];
            }
          },
          (err) => {
            console.log(err);
          }
        );
        fetchSumVolume(sumQuery2).then(
          (response) => {
            console.log("地磁数据", response);
            if (response.data.length == 0) {
              // this.sumData = theseDateSum;
            } else {
              theseDateSum = theseDateSum + response.data[0]['sum(Volume)'];
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.sumData = theseDateSum
      }
      //时间段不包含静态数据
      else {
        console.log("sumQuery22");
        //地磁总量请求 有参数sumQuery暂时不加
        const sumQuery = {
          start: actu_start,
          end: actu_end,
        };
        fetchSumVolume(sumQuery).then(
          (response) => {
            console.log("地磁数据", response);
            if (response.data.length == 0) {
              // this.sumData = theseDateSum;
            } else {
              this.sumData = response.data[0]['sum(Volume)'];
              console.log();
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
      const sumQuery2 = {
        startTime: this.dates.sumDate[0].format("yyyy-MM-dd hh:mm:ss"),
        endTime: this.dates.sumDate[1].format("yyyy-MM-dd hh:mm:ss"),
      };
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
