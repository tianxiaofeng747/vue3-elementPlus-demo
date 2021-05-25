/*
 * @Author: jinqing
 * @Date: 2021-04-23 10:41:01
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 14:51:09
 * @Description: file content
 */
import { createApp } from 'vue';
import App from './App.vue';
import Store from './store/index';
import ElementPlus from 'element-plus';
import axios from './utils/axios';
import YlTable from './components/table/index.jsx';
import YlIcon from './components/icon/index.jsx';
import '@/style/basis.scss';
import 'element-plus/lib/theme-chalk/index.css';
import router from './router/index'; 
import './mock/index';
import { defineAsyncComponent} from 'vue';
import Tools from '@/utils/customer/global.js';
const modules = import.meta.glob('./pages/**/index.vue');

// import YcloudUi, { changeEnvironment, sentry } from 'ycloud-ui';
const MyApp = createApp(App);
MyApp.use(router);
MyApp.use(ElementPlus);
MyApp.use(Store);
// MyApp.use(YcloudUi);

Object.keys(modules).forEach(fileName => {
    // 获取组件配置
    const componentConfig = defineAsyncComponent(modules[fileName]);
    const filterName = /^\.\/pages(.*)\/index\.vue/g.exec(fileName)[1];
    const componentName = Tools.reverseComponentName(filterName);
    console.log(componentName);
    // componentConfig
    // 全局注册组件
    MyApp.component(
        componentName, componentConfig
    );
});

MyApp.component('YlTable',YlTable);
MyApp.component('YlIcon',YlIcon);
MyApp.mount('#app');
MyApp.provide('$app', MyApp);
// 全局这样挂载
MyApp.config.globalProperties.Http = axios;