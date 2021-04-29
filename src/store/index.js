/*
 * @Author: jinqing
 * @Date: 2021-04-23 14:22:02
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-23 15:00:37
 * @Description: file content
 */
import {createStore} from 'vuex';
import user from './modules/user.js';
import getters from './getters.js';
const store = createStore({
    modules: {
        user
    },
    getters
});

export default store;
