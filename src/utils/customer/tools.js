/*
 * @Author: jinqing
 * @Date: 2020-11-05 10:02:48
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-23 16:12:15
 * @Description: file content
 */
/**
 * 数据字典
 * @param {*options} obj
 * @param type  平台端数据字典还是 企业端 qiye，默认是平台端 pingtai
 */
import Http from '@/utils/axios';
import store from '@/store/index';
let tools = {
    qiye: {}, // 企业专用  默认是企业
    pingtai: {} // 平台专用 pingtai
};
export const Dictionarie = (code, isRefresh, type = 'qiye') => {
    if (type !== 'qiye') {
        type = 'pingtai';
    }
    if (tools[type][code] && !isRefresh) {
        return Promise.resolve(tools[type][code]);
    } else {
        return new Promise((resolve, reject) => {
            if (type === 'qiye') {
                Http('ddc.dict.enterprise.findByNumber', {
                    ignoreRepeat: true, // 防止连续请求错误
                    number: code,
                    enterpriseNo: store.getters.enterpriseNo
                }).then(result => {
                    let list = result.data.children || [];
                    if (list.length) {
                        tools[type][code] = list.map(item => ({
                            dictVal: item.dictVal,
                            number: item.dictNumber,
                            source: {
                                ...item
                            }
                        }));
                        resolve(tools[type][code]);
                    }
                });
            } else {
                Http('ddc.dict.platform.findByNumber', {
                    ignoreRepeat: true, // 防止连续请求错误
                    number: code
                }).then(result => {
                    let list = result.data.children || [];
                    if (list.length) {
                        tools[type][code] = list.map(item => ({
                            dictVal: item.modValue,
                            number: item.number,
                            source: {
                                ...item
                            }
                        }));
                        resolve(tools[type][code]);
                    }
                });
            }
        });
    }
};