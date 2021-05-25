/*
 * @Author: 云医购
 * @Date: 2019-07-15 14:16:18
 * @LastEditors: yangjj
 * @LastEditTime: 2019-07-15 14:38:17
 * @Description: 数据字典信息
 */
import { Tools } from 'ycloud-ui';
import axios from '@/utils/axios/index.js';

const URL = {
    findByNumber: 'yhlo.brp.dict.platform.findByNumber' // 获取整棵树
};
const dist = {
    state: {

    },
    mutations: {

    },
    actions: {
        // 获取数据字典
        getDict({ commit, state }, key, params, refresh = false) {
            return new Promise((resolve, reject) => {
                if (!refresh && state[key]) {
                    resolve(state[key]);
                } else {
                    let _params = {
                        ignoreRepeat: true
                    };
                    let type = Tools.getType(params);
                    if (type === '[Object]') {
                        _params = { ..._params, ...params };
                    } else if (type === '[String]') {
                        _params = { ..._params, number: params };
                    }
                    axios.Http(URL.findByNumber, _params).then(res => {
                        let rows = res.data;
                        commit('SETOPENLINKCHANNEL', rows);
                        resolve(rows);
                    }).catch(err => {
                        reject(err);
                    });
                }
            });
        }
    }
};
export default dist;
