/*
 * @Author: jinqing
 * @Date: 2020-04-09 08:42:19
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-29 14:59:05
 * @Description: file content
 */ 
export default {
    // http  local
    tableMode: 'local',
    unSetCols: ['序号', '操作'],
    tableUrl: {
        get: 'ddc.csc.configure.getDynamicTitle',
        save: 'ddc.csc.configure.saveDynamicTitle'
    }
};