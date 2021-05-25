/*
 * @Author: jinqing
 * @Date: 2021-04-23 10:45:27
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 09:45:27
 * @Description: file content
 */
import {
    createRouter,
    createWebHistory,
    RouteRecordRaw
} from 'vue-router';
import store from '@/store/index.js';
import Layout from '@/pages/basic/layout/Layout.vue';
import Error from '@/components/error/index.vue';
import BASE from '@/utils/constant/index.js';
const routes: Array<RouteRecordRaw> = [
    { path: '', redirect: '/app/hello' },
    {
        path: '/login',
        component: () => import('../pages/basic/login/index.vue'),
        name: 'login'
    },
    {
        path: '/app',
        component: Layout,
        // funcIcon: 'icon-daohang-jichu',
        children: [
            {
                path: BASE.defaultUrl,
                name: 'hello',
                // funcIcon: 'icon-daohang--5',
                component: {template: 'index'},
                meta: {
                    name: '首页',
                    componentUrl: 'basic/index'
                }
            },
        
            {
                path: '404',
                component: Error,
                meta: { name: '未知页面' },
                name: 'errorPage'
            }
        ]
    }
];
  
const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    if (BASE.skipAuth.includes(to.path)) {
        next();
    } else {
        store.commit('REFRESH');
        if (!store.getters.menuList) {
            // 判断当前用户是否登陆
            const user = store.getters.userInfo;
            // !user || !user.enterpriseNo
            if (!user) {
                next('/login');
                return;
            }
            store.dispatch('getUserMenus').then(res => {
                const permission = res || {};
                store.commit('setMenuList', permission.menuTree);
                store.dispatch('generateRouters', permission.menuTree).then(list => {
                    const app = {
                        path: '',
                        component: Layout,
                        name: 'root',
                        children: list
                    };
                    console.log(app);
                    router.addRoute(app); // 必须是数组,动态添加可访问路由表
                    next({ ...to }); // hack方法 确保addRoutes已完成 
                });
            }).catch(errs => {
                // 无法获取权限则跳到登入页,无权限进入系统
                next('/login');
            });
        } else if (to.matched.length) {
            next();
        } else {
            next(BASE.defaultUrl);
        }
    }
});
export {
    routes
};
export default router;
  