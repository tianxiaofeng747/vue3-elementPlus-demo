import axios from '@/utils/axios/index.js';
import Tools from '@/utils/customer/global.js';
const URL = {
    iconsList: 'ddc.uim.icon.findListForString', // icon接口
    iconUrl: 'http://at.alicdn.com/t/font_977230_hoyr74hpajn.css' // 图标列表来自于 iconfont 当前版本库
};

const permission = {
    state: {
        sidebar: {
            // 侧边栏状态
            opened: !parseInt(sessionStorage.getItem('sidebarStatus'))
        },
        activeNav: '',
        tempNavs: [], // 临时导航
        cachedViews: [], // 缓存Views
        auth: {},
        iconlist: [],
        leftMenu: []
    },
    mutations: {
        // 设置菜单是否展开
        TOGGLE_SIDEBAR: (state) => {
            if (state.sidebar.opened) {
                sessionStorage.setItem('sidebarStatus', 1);
            } else {
                sessionStorage.setItem('sidebarStatus', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
        },
        // 添加或设置tab
        SETTEMPNAVS: (state, item) => {
            if (item instanceof Array) {
                state.tempNavs = item;
                state.cachedViews = item.filter(data => data.meta.cache).map(data => Tools.reverseComponentName(data.name));
                return;
            }
            let indexNo = 0,
                notInclude = true;
            state.tempNavs.forEach((data, index) => {
                data.name === state.activeNav && (indexNo = index);
                // 已包含
                if (data.name === item.name) {
                    Object.assign(data, item);
                    // data.label = item.label;
                    notInclude = false;
                }
            });
            if (notInclude) {
                state.tempNavs.splice(indexNo + 1, 0, { ...item });
            }
            state.activeNav = item.name;
            let cacheName = Tools.reverseComponentName(item.name);
            if (item.meta.cache && !state.cachedViews.includes(cacheName)) {
                state.cachedViews.push(cacheName);
            }
        },
        // 删除单个 tab
        REMOVENAV: (state, obj) => {
            let tabs = state.tempNavs;
            if (tabs.length === 1) {
                return;
            }
            let { closeName, targetName } = { closeName: state.activeNav, ...obj };
            // 算出下一个激活router name
            if (closeName === state.activeNav && !targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === closeName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            targetName = nextTab.name;
                        }
                    }
                });
            }
            targetName && (state.activeNav = targetName);
            state.tempNavs = tabs.filter(tab => tab.name !== closeName);
            let cacheName = Tools.reverseComponentName(closeName);
            for (const i of state.cachedViews) {
                if (i === cacheName) {
                    const index = state.cachedViews.indexOf(i);
                    state.cachedViews.splice(index, 1);
                    break;
                }
            }
        },
        // 选中tab
        SETACTIVENAV: (state, data) => {
            state.activeNav = data;
        },
        SETICONS: (state, data) => {
            state.iconlist = data;
        },
        // 设置左侧菜单
        SEFLEFTMENU: (state, data) => {
            state.leftMenu = data;
        },
        setAuth: (state, data) => {
            state.auth = data;
        }
    },
    actions: {
        // 获取icon
        GetIcons ({ commit, state }) {
            return new Promise((resolve, reject) => {
                state.iconlist.length ? resolve(state.iconlist) : axios.Http(URL.iconsList, {
                    params: {
                        iconSourceUrl: URL.iconUrl
                    }
                }).then(res => {
                    let rows = res.data;
                    commit('SETICONS', rows);
                    resolve(rows);
                }).catch(err => {
                    reject(err);
                });
            });
        }
    }
};

export default permission;
