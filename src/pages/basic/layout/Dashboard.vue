<!--
 * @Author: jinqing
 * @Date: 2021-05-11 15:16:39
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 10:18:45
 * @Description: file content
-->
<template>
    <section class="app-main">
        <keep-alive :include="cachedViews" :max="10">
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
//const modules = import.meta.glob('../../**/index.vue');

let reverseComponentName = (str) => str.replace(/(\/|\.)/g, '');
export default defineComponent({
    inject: ['$app'],
    data () {
        return {
            permissions: null
        };
    },
    computed: {
        cachedViews () {
            return this.$store.state.app.cachedViews;
        }
    },
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
        let componentName = ref();
        const _getBtnAuth = (no) => {
            store.getters.buttons && store.getters.buttons.forEach(item => {
                if (item.parentFuncNo === no) {
                    permissions[item.funcCode] = item.funcName;
                }
            });
        };
        const updateComponent = () => {
            let path = route.meta.componentUrl;
            let comPath = /^\//.test(path) ? path : ('/' + path);
            comPath  = reverseComponentName(comPath);
            //console.log(comPath);
            if(comPath){
                componentName.value = `pages${comPath}indexvue` // resolveDynamicComponent();
            } else {
                componentName.value = Error;
            }
        };
        watch(() => route.path, updateComponent);
        return {
            componentName
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
