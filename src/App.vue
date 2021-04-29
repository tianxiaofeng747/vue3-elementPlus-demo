<!--
 * @Author: jinqing
 * @Date: 2021-04-23 10:41:01
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-29 16:43:20
 * @Description: file content
-->
<template>
	<el-tabs v-model="activaPage" @tab-click="goUrl">
		<el-tab-pane v-for="item in list" :key="item.name" :label="item.meta.label" :name="item.name">
		</el-tab-pane>
	</el-tabs>
    <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { routes } from './router/index';
export default defineComponent({
    name: 'App',
	data(){
		return {
			activaPage: 'Home',
			list: [
				...routes
			]
		}
	},
	setup: () => {
		
	},
	methods:{
		goUrl(){
			this.$router.push({
				name: this.activaPage
			});
		}
	},
    components: {},
});
</script>

<style>

</style>
