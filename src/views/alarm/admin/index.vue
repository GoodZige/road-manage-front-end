<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">查询报警信息</p>
          <el-row>
            <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
              <el-date-picker
                v-model="dates.date"
                type="date"
                align="right"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :lg="5" class="btn-col">
              <a
                class="pan-btn blue-btn"
                style="line-height: 12px"
                @click="selectAlarm"
                >查询</a
              >
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <el-table
          v-loading="allList.listLoading"
          :data="allList.list"
          element-loading-text="Loading..."
          border
          fit
          highlight-current-row
        >
          <el-table-column type="index" width="55" label="ID">
            <template scope="scope"
              ><span>{{ scope.$index + 1 }} </span></template
            >
          </el-table-column>

          <el-table-column label="时间">
            <template slot-scope="scope">
              {{ scope.row.date }}
            </template>
          </el-table-column>
          <el-table-column label="报警设备名称及ID">
            <template slot-scope="scope" class="msg">
              {{ scope.row.msgStr }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SumPanel from "./components/SumPanel";
import MixChart from "./components/MixChart";
import { parseTime } from "@/utils";
import SecMixChart from "./components/SecMixChart";

// import { parseTime } from '@/utils'

import { fetchAlarm } from "@/api/road";
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
    SumPanel,
    MixChart,
    SecMixChart,
  },
  data() {
    return {
      allList: {
        list: null,
        listLoading: true,
        downloadLoading: false,
        filename: "",
        autoWidth: true,
        bookType: "xlsx",
      },
      dates: {
        date: null,
      },
      sheetData: [],
    };
  },
  watch: {
    // addressValue: function (newValue) {
    //   console.log(this.addressOptions.find((item) => item.value === newValue));
    //   this.roadOptions = this.addressOptions.find(
    //     (item) => item.value === newValue
    //   ).roadOptions;
    // },
  },
  mounted() {
    this.dates.date = new Date().format("yyyy-MM-dd");
    this.selectAlarm()
  },
  created() {},
  methods: {
    selectAlarm() {
      console.log(this.dates.date);
      let query = {
        date: this.dates.date,
      };
      fetchAlarm(query).then((response) => {
        if (response.data.length==0) {
          this.allList.list = [];
          this.allList.listLoading = false;
        }else{
          console.log("alarm：", response.data);
          console.log(JSON.parse(response.data[0].message));
          let sheetData = [];
          for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            let msgs = JSON.parse(element.message);
            let msgStr = "";
            for (let j = 0; j < msgs.length; j++) {
              const msg = msgs[j];
              if (j == msgs.length - 1) {
                msgStr = msgStr + msg.CrossName + "，" + msg.CrossId;
              } else {
                msgStr = msgStr + msg.CrossName + "，" + msg.CrossId + " —— ";
              }
            }
            sheetData.push({
              date: element.date,
              msgStr: msgStr,
            });
          }
          this.allList.list = sheetData;
          console.log(sheetData);
          this.allList.listLoading = false;
        }
      });
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
.msg{
  white-space:"pre"
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
