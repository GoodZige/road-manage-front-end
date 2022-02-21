<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="input-wrapper">
          <p class="choose-title">上传缺失数据</p>
          <el-row>
            <el-col>
              <el-col :xs="24" :sm="24" :lg="6" class="btn-col">
                <el-date-picker
                v-model="params.time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
                </el-date-picker>
              </el-col>

              <el-col :xs="24" :sm="24" :lg="5" class="btn-col">
                <a
                  class="pan-btn blue-btn"
                  style="line-height: 12px"
                  @click="upload"
                  >上传</a
                >
              </el-col>
            </el-col>
            
            <el-col style="padding: 5px 0;">
              <el-col :span="6">
                <el-input v-model="params.YK15" type="number" placeholder="YK15"></el-input>
              </el-col>
            </el-col>
            <el-col style="padding: 5px 0;">
              <el-col :span="6">
                <el-input v-model="params.YK2" type="number" placeholder="YK2"></el-input>
              </el-col>
            </el-col>
            <el-col style="padding: 5px 0;">
              <el-col :span="6">
                <el-input v-model="params.YK12" type="number" placeholder="YK12"></el-input>
              </el-col>
            </el-col>
            <el-col style="padding: 5px 0;">
              <el-col :span="6">
                <el-input v-model="params.ZK12" type="number" placeholder="ZK12"></el-input>
              </el-col>
            </el-col>
            <el-col style="padding: 5px 0;">
              <el-col :span="6">
                <el-input v-model="params.ZK2" type="number" placeholder="ZK2"></el-input>
              </el-col>
            </el-col>
            <el-col style="padding: 5px 0;">
              <el-col :span="6">
                <el-input v-model="params.ZK15" type="number" placeholder="ZK15"></el-input>
              </el-col>
            </el-col>

            
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { uploadMissingData } from "@/api/road";

export default {
  name: "RepairAdmin",
  components: {},
  data() {
    return {
      params:{
        time:'',
        YK15:'',
        YK2:'',
        YK12:'',
        ZK12:'',
        ZK2:'',
        ZK15:'',
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {},
  methods: {
    upload(){
      console.log(this.params);
      if(this.params.time==''){
        this.$message({
          message: '请选择日期',
          type: 'warning'
        });
      }
      else if(this.params.YK15=='' || this.params.YK2=='' || this.params.YK12=='' || this.params.ZK12=='' || this.params.ZK2=='' || this.params.ZK15==''){
        this.$message({
          message: '所有数据都需要填写',
          type: 'warning'
        });
      }
      else{
        uploadMissingData(this.params).then((response) => {
          console.log(response);
          this.$message({
            message: '上传成功',
            type: 'success'
          });
        }
        ).catch((e)=>{
          this.$message({
            message: '上传失败',
            type: 'error'
          });
        });
      }
    }
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
