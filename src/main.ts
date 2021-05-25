/*
 * @Author: jinqing
 * @Date: 2021-04-23 10:41:01
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 15:24:09
 * @Description: 入口文件
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
    const componentConfig = defineAsyncComponent(modules[fileName]);
    const filterName = /^\.\/pages(.*)\/index\.vue/g.exec(fileName)[1];
    const componentName = Tools.reverseComponentName(filterName);
    // 这一句话很重要， keep-alive include 数组里面是 组件的名字， 所以这里注册组件的时候，给异步组件名赋值。
    componentConfig.name = componentName;
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