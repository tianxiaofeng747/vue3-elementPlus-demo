/*
 * @Author: jinqing
 * @Date: 2021-05-11 15:21:03
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 14:03:51
 * @Description: file content
 */
import { routes } from '@/router/index';
import BASE from '@/utils/constant/index.js';
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routers
 * @param leval 递归层级
 */
const filterAsyncRouter = (routers, leval = 1) => {
    let asyncRouterMap = routers.map(item => {
        let funcUrl = (item.permissionUrl || '').split('?');
        item.path = (item.path && item.path.split('?')[0]) || 'app/404';
        item.name = (funcUrl[0] + item.no);
        item.component = {
            template: item.name
        };
        item.meta = {
            name: item.label,
            componentUrl: funcUrl[0],
            no: item.no,
            pageTips: item.pageTips || '',
            query: funcUrl[1],
            leval: leval,
            cache: true // BASE.cacheUrls.includes(item.funcUrl)
        };
        BASE.pageNames[funcUrl[0]] = false;
        (item.children && item.children.length) && (item.children = filterAsyncRouter(item.children, leval + 1));
        return item;
    });
    return asyncRouterMap;
};

const permission = {
    state: {
        roles: null, // 用户权限
        routers: null // 路由
    },
    mutations: {
        // 设置路由
        SET_ROUTERS (state, routers) {
            state.routers = routes.concat(routers); // 保存全部路由
            // console.log(JSON.stringify(state.routers, 2));
            sessionStorage.setItem('route', JSON.stringify(state.routers));
        }
    },
    actions: {
        // 生成路由生成路由
        async generateRouters ({ commit, state }, menus) {
            return new Promise(resolve => {
                let accessedRouters = filterAsyncRouter(menus.menuTree);
                console.log(accessedRouters);
                commit('SET_ROUTERS', accessedRouters);
                resolve(accessedRouters);
            });
        }
    }
};

export default permission;
