<!--
 * @Author: jinqing
 * @Date: 2021-05-24 17:33:24
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 13:13:50
 * @Description: file content
-->
<template>
    <div class="section">
        潜在供应商
        <el-row>
            <el-col>
                <el-input v-model="keywords2"></el-input>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {defineComponent}from 'vue';
export default defineComponent({
    data(){
        return {
            keywords2: ''
        }
    }
});
</script>