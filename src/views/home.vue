<!--
 * @Author: jinqing
 * @Date: 2021-04-23 10:46:16
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-25 10:28:20
 * @Description: file content
-->
<template>
    <div>
        欢迎你：{{userName}}
        <el-button @click="goLogin">登录</el-button>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref } from 'vue';
import UserLogin from './mods/userLogin';
 import {useStore } from 'vuex';
import _ColorPicker from 'element-plus/lib/el-color-picker';
//import Son from './mods/son';
export default defineComponent({
    name: 'App',
	data(){
		return {
            count: 0,
			list: [
				{
					name: 'home',
					link: '/'
				}
			]
		}
	},
    setup: (props) => {
        // const { proxy } = getCurrentInstance();
        // proxy.Http('currentUser').then((res:Object) => {
        //     console.log(res);
        // });
        const store = useStore();
        const userName = computed(() => {
            return store.getters.userInfo.userName
        });
        const goLogin = () => {
            UserLogin();
        };
        return {
            userName,
            goLogin
        };
    },
    components: {},
});
</script>
