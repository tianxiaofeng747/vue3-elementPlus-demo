<!--
 * @Author: jinqing
 * @Date: 2021-05-11 15:16:39
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 15:03:27
 * @Description: file content
-->
<template>
    <section class="app-main">
        <keep-alive :include="cachedTabs" :max="10">
            <component :is="componentName" ></component>    
        </keep-alive>
    </section>
</template>
<script>
import Error from '@/components/error/index.vue';
import Nav from '@/components/navPage/index.vue';
import { defineComponent, resolveDynamicComponent, watch,ref} from 'vue';
import {useRoute} from 'vue-router';
import { mapGetters, useStore } from 'vuex';
import Tools from '@/utils/customer/global.js';
//const modules = import.meta.glob('../../**/index.vue');

export default defineComponent({
    inject: ['$app'],
    data () {
        return {
            permissions: null
        };
    },
    // computed: {
    //     cachedViews () {
    //         console.log(this.$store.state.app.cachedViews)
    //         return this.$store.state.app.cachedViews;
    //     }
    // },
    methods: {
        // 初始化按钮权限
        async initPermission () {
            let no = this.$route.meta.no || this.$route.query.$no,
                permissions = {},
                path = this.$route.meta.componentUrl;
            this._getBtnAuth(no, permissions);
            this.$store.commit('setAuth', permissions);
            console.log(permissions, '按钮权限');
            // 模块点击，直接用navPage组件
            if (this.$route.meta.leval === 2) {
                this.componentName = Nav;
                return;
            }
            path = /^\//.test(path) ? path : ('/' + path);
        }
    },
    setup(){
        let route = useRoute(),
            store = useStore(),
            permissions = {};
        let componentName = ref(),
            cachedTabs = ref([]);
        const _getBtnAuth = (no) => {
            store.getters.buttons && store.getters.buttons.forEach(item => {
                if (item.parentFuncNo === no) {
                    permissions[item.funcCode] = item.funcName;
                }
            });
        };
        //设置缓存tab
        const getCacheView = () => {
            let list = store.getters.cachedViews;
            list = list.map(item => item.replace(/\d/g,''));
            cachedTabs.value = list;
            console.log(list);
        };
        const updateComponent = () => {
            let comPath = Tools.reverseComponentName(route.meta.componentUrl);
            getCacheView();
            if(route.meta.leval === 2){
                componentName.value = Nav;
            }
            else if(comPath){
                componentName.value = comPath // resolveDynamicComponent();
            } else {
                componentName.value = Error;
            }
            
        };
        watch(() => route.path, updateComponent);
        updateComponent();
        return {
            componentName,
            cachedTabs
        }
    },
    components: {
        Error
    }
})
</script>

<style lang="scss">
    .app-main {
        box-sizing: border-box;
    }
</style>
