/*
 * @Author: jinqing
 * @Date: 2021-04-23 10:41:01
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-28 15:47:55
 * @Description: file content
 */
import { createApp } from 'vue';
import App from './App.vue';
import Store from './store/index';
import ElementPlus from 'element-plus';
import axios from './utils/axios';
import YlTable from './components/table/index.jsx';
import '@/style/basis.scss';
import 'element-plus/lib/theme-chalk/index.css';
import router from './router/index'; 

const MyApp = createApp(App);
MyApp.use(router);
MyApp.use(ElementPlus);
MyApp.use(Store);
MyApp.component('YlTable',YlTable);
MyApp.mount('#app');
// 全局这样挂载
MyApp.config.globalProperties.Http = axios;