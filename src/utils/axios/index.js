/*
 * @Author: jinqing
 * @Date: 2021-04-23 10:50:42
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-11 17:23:43
 * @Description: file content
 */
/**
 * axios basic configuration
 */
import axios from 'axios';
// 环境配置
import Interceptor from './interceptor';
const TimeOut = 15000;
let myAxios = axios.create();
// 初始化拦截器
new Interceptor(myAxios, TimeOut); // eslint-disable-line no-new
// 配置
const configuration = [
    'version', // 版本
    'ignoreRepeat', // 忽略防止重复请求
    'verifycode', // 验证码
    'Authorization' // 客户端base64加密
];
/**
 * 基础配置
 * 更多配置请参考 https://github.com/axios/axios
 * @param {*} url  请求地址
 * @param {*} data  参数
 * @param {*} type  请求类型,默认post
 */
const Http = (url, data = {}, type = 'post') => {
    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    };
    // 添加header token
    let query; 
    // 处理配置
    for (const item of configuration) {
        if (data[item]) {
            headers[item] = data[item];
            delete data[item];
        }
    }
    if (url.split('.').length === 1 || ~url.indexOf('.json') || type === 'get') {
        query = url;
    } else {
        query = 'call?apiCode=' + url + '&apiVersion=' + (headers.version || '');
    }
    const config = {
        url: query,
        method: type,
        data: data,
        timeout: TimeOut, // 超时时间
        headers: headers,
        responseType: 'json',
        validateStatus: function (status) {
            return status >= 200 && status < 300; // 默认的
        },
        maxRedirects: 5
    };
    let response = null;
    try {
        response = myAxios(config);
    } catch (error) {
        response = Promise.reject(error);
    }
    return response;
};

export default Http;
