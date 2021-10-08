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
    url: '/countByHour',
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
// 获取总量统计
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
// 海康统计各维度条件下的过车流量v3
export function fetchHKSum(query) {
  return request({
    // 349w081g01.zicp.vip:50770
    url: '/api/aiapplication/v3/vehicle/queryStatisticsVehiclesByGroupWithPage',
    method: 'post',
    params: query
  })
}
