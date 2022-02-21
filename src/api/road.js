import request from '@/utils/request'


export function fetchAnalysis(query) {
  return request({
    url: '/analysis',
    method: 'get',
    params: query
  })
}
export function fetchCountByHour(query) {
    return request({
      url: '/countByHoursV',
      method: 'get',
      params: query
    })
  // let nowDate = new Date()
  // let nowHour = nowDate.getHours()
  // if (nowHour>=22||nowHour<=6) {
  //   return request({
  //     url: '/countByHour',
  //     method: 'get',
  //     params: query
  //   })
  // }else{
  //   console.log(process.env.VUE_APP_PROJECT_NAME);
  //   let rqUrl = '/countByHourB'
  //   if (process.env.VUE_APP_PROJECT_NAME=='五局') {
  //     rqUrl = '/countByHourA'
  //   }
  //   return request({
  //     url: rqUrl,
  //     method: 'get',
  //     params: query
  //   })
  // }
}


// 按照新接口获取车道的月数据
export function getMonthVolume(query) {
  return request({
    url: '/monthValueV',
    method: 'get',
    params: query
  })
  // let nowDate = new Date()
  // let nowHour = nowDate.getHours()
  // if (nowHour>=22||nowHour<=6) {
  //   return request({
  //     url: '/countMonthVolume',
  //     method: 'get',
  //     params: query
  //   })
  // }else{
  //   console.log(process.env.VUE_APP_PROJECT_NAME);
  //   let rqUrl = '/countMonthVolumeB'
  //   if (process.env.VUE_APP_PROJECT_NAME=='五局') {
  //     rqUrl = '/countMonthVolumeA'
  //   }
  //   return request({
  //     url: rqUrl,
  //     method: 'get',
  //     params: query
  //   })
  // }
  
}
//按照接口获取车道的日数据
export function getDayVolume(query) {
  return request({
    url: '/countByCrossIDV',
    method: 'get',
    params: query
  })
  // let nowDate = new Date()
  // let nowHour = nowDate.getHours()
  // if (nowHour>=22||nowHour<=6) {
  //   return request({
  //     url: '/countByCrossID',
  //     method: 'get',
  //     params: query
  //   })
  // }else{
  //   console.log(process.env.VUE_APP_PROJECT_NAME);
  //   let rqUrl = '/countByCrossIDB'
  //   if (process.env.VUE_APP_PROJECT_NAME=='五局') {
  //     rqUrl = '/countByCrossIDA'
  //   }
  //   return request({
  //     url: rqUrl,
  //     method: 'get',
  //     params: query
  //   })
  // }
}

//按照接口获取车道的地磁日数据
export function fetchDiCiVolume(query) {
    return request({
      url: '/countByCrossID',
      method: 'get',
      params: query
    })
}

//按照接口获取车道的地磁日数据
export function fetchHKVolume(query) {
  console.log(process.env.VUE_APP_PROJECT_NAME);
  let rqUrl = '/countByCrossIDB'
  if (process.env.VUE_APP_PROJECT_NAME=='五局') {
    rqUrl = '/countByCrossIDA'
  }
  return request({
    url: rqUrl,
    method: 'get',
    params: query
  })
}





// 获取地点及车道列表
export function fetchAddress() {
  return request({
    url: '/getCrossLano',
    method: 'get'
  })
}
// 获取总量统计  query
export function fetchSumVolume(query) {
  return request({
    url: '/getTrafficVolume',
    method: 'get',
    params: query
  })
}
// 获取总量统计
export function fetchMonthVolume(query) {
  return request({
    url: '/getMonthVolume',
    method: 'get',
    params: query
  })
}
//海康总量 query
export function fetchhaikangVolume(query) {
  return request({
    url: '/timeTotle',
    method: 'get',
    params: query
  })
}
//获取图片
export function fetchMonthpicture(query) {
  return request({
    url: '/timeData',
    method: 'get',
    params: query
  })
}
// 海康统计各维度条件下的过车流量v3
export function fetchHKSum(query) {
  return request({
    // 349w081g01.zicp.vip:50770
    url: '/api/aiapplication/v3/vehicle/queryStatisticsVehiclesByGroupWithPage',
    method: 'post',
    params: query
  })
}
//报警信息
export function fetchAlarm(query) {
  return request({
    url: '/getAlarm',
    method: 'get',
    params: query
  })
}

//缺失数据上传
export function uploadMissingData(query) {
  return request({
    url: '/manualAddData',
    method: 'get',
    params: query
  })
}