/*
 * @Author: jinqing
 * @Date: 2021-04-23 10:45:27
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-28 10:48:50
 * @Description: file content
 */
import {
    createRouter,
    createWebHistory,
    RouteRecordRaw
} from 'vue-router';
import Home from '@/views/home.vue';
import Customer from '@/views/customer/index.vue';
  
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        meta: {
            label: '首页'
        },
        component: Home
    },
    {
        path: '/customer',
        name: 'customer',
        meta: {
            label: '客户'
        },
        component: Customer
    },
    {
        path: '/axios',
        name: 'Axios',
        meta: {
            label: 'table组件'
        },
        component: () => import('@/views/supplier/index.vue') // 懒加载组件
    }
];
  
const router = createRouter({
    history: createWebHistory(),
    routes
});
export {
    routes
};
export default router;
  