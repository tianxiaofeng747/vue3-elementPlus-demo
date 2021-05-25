<!--
 * @Author: jinqing
 * @Date: 2021-04-23 10:41:01
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-12 13:36:56
 * @Description: file content
-->
<template>
    <div id="app">
		<router-view v-slot="{ Component }">
			<transition>
				<keep-alive>
					<component :is="Component" />
				</keep-alive>
			</transition>
		</router-view>
        <!-- <transition name="router-fade" mode="out-in">
            <router-view></router-view>
        </transition> -->
    </div>
</template>

<script>
export default {
    name: 'app'
};
</script>

<style lang="scss">
@import './style/basis.scss';
html,
body,
#app {
    height: 100%;
}

.router-fade-enter-active,
.router-fade-leave-active {
    transition: opacity 0.3s;
}

.router-fade-enter,
.router-fade-leave-active {
    opacity: 0;
}
</style> 
