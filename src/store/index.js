/*
 * @Author: jinqing
 * @Date: 2021-04-23 14:22:02
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-11 15:21:36
 * @Description: file content
 */
import {createStore} from 'vuex';
import user from './modules/user.js';
import permission from './modules/permission.js';
import app from './modules/app.js';
import getters from './getters.js';
const store = createStore({
    modules: {
        user,
        permission,
        app
    },
    getters
});

export default store;
