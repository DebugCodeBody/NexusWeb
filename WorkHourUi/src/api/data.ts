import request from "@/utils/request"
import type { WorkTables, WorkTable } from "@/layout/module"

import Mock from 'mockjs';

//使用mockjs模拟数据
// Mock.mock(/getworkdata/, function(params:any){
//     return {
//         code: 200,
//         "data": [{"time":"06-01","clock":["10:10","12:12","13:41","17:41","18:01","22:50"],"work":"2.50","meals":"25.50","buckle":"-13.50","leave":[],"error":false},{"time":"06-02","clock":["10:11","12:07","13:40","17:37","19:38","22:54"],"work":"0.67","meals":"26.00","buckle":"-14.00","leave":[],"error":false},{"time":"06-03","clock":[],"work":"0","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-04","clock":["  :  ","  :  ","  :  ","  :  ","  :  ","  :  "],"work":"-8.00","meals":"0","buckle":"0","leave":["06-03 18:00","06-06 12:00","回家"],"error":false},{"time":"06-05","clock":[],"work":"0","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-06","clock":["  :  ","  :  ","  :  ","  :  ","  :  ","  :  "],"work":"-8.00","meals":"0","buckle":"0","leave":["06-03 18:00","06-06 12:00","回家"],"error":false},{"time":"06-07","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-08","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-09","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-10","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-11","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-12","clock":[],"work":"0","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-13","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-14","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-15","clock":[],"work":"-8","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-16","clock":["13:31","17:51","18:15","23:01"],"work":"0.84","meals":"0","buckle":"12","leave":[],"error":false},{"time":"06-17","clock":["10:09","12:07","13:38","17:38","18:03","22:42"],"work":"2.16","meals":"22.00","buckle":"-10.00","leave":[],"error":false},{"time":"06-18","clock":["11:17","12:10","13:42","17:35","18:04","22:35"],"work":"0.83","meals":"24.50","buckle":"-12.50","leave":[],"error":false},{"time":"06-19","clock":["14:36","18:29"],"work":"3.67","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-20","clock":["10:48","12:07","13:40","17:36","18:21","23:10"],"work":"1.67","meals":"23.50","buckle":"-11.50","leave":[],"error":false},{"time":"06-21","clock":["10:37","12:10","13:46","17:43","18:05","22:46"],"work":"1.83","meals":"22.00","buckle":"-10.00","leave":[],"error":false},{"time":"06-22","clock":["10:56","12:09","13:38","18:03","23:18"],"work":"-2.67","meals":"19.50","buckle":"-13.50","leave":[],"error":true},{"time":"06-23","clock":["10:38","12:06","13:40","17:39","18:32","22:59"],"work":"1.33","meals":"0","buckle":"12","leave":[],"error":false},{"time":"06-24","clock":["10:34","12:10","13:44","17:39","18:05","23:00"],"work":"2.00","meals":"20.00","buckle":"-8.00","leave":[],"error":false},{"time":"06-25","clock":["11:13","13:44","17:36","18:03","21:47"],"work":"-5.34","meals":"0","buckle":"0","leave":[],"error":true},{"time":"06-26","clock":["16:03","19:14"],"work":"3.00","meals":"0","buckle":"0","leave":[],"error":false},{"time":"06-27","clock":["10:23","12:04","13:45","17:41","18:02","18:29","  :  ","  :  ","21:33","23:19"],"work":"-1.16","meals":"24.50","buckle":"-18.50","leave":["06-27 18:29","06-27 20:00","1",""],"error":false},{"time":"06-28","clock":["13:37","17:37","18:10","00:36"],"work":"2.16","meals":"23.40","buckle":"-11.40","leave":[],"error":false},{"time":"06-29","clock":["10:59","12:12","13:43","17:35","18:05","00:08"],"work":"2.67","meals":"23.00","buckle":"-11.00","leave":[],"error":false},{"time":"06-30","clock":["13:46","17:35","18:05","22:49"],"work":"0.17","meals":"31.50","buckle":"-19.50","leave":[],"error":false},{"time":"06-31","clock":[],"work":null,"meals":null,"buckle":null,"leave":[],"error":true}]
//     }
// });
// Mock.mock(/getweekstate/, function(params:any){
//     return {
//         code: 200,
//         "data": true 
//     }
// });

export function getDate(empid: string, month: number) {
    return request({
        url: "/getdate",
        params: { empid, month }
    }) as any as Promise<{
        result: WorkTable[],
        allcheck: boolean
    }>
}


export function getWeekState(empid: string, start: string, end: string) {
    return request({
        url: "/getstate",
        params: { empid, start, end }
    })
}

export function setWeekState(empid: string, start: string, end: string, state: number) {
    return request({
        url: "/setstate",
        params: { empid, start, end, state }
    })
}


