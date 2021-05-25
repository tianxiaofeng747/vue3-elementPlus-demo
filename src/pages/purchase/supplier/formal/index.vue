<!--
 * @Author: jinqing
 * @Date: 2021-05-24 17:33:24
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 13:13:14
 * @Description: file content
-->
<template>
    <div>
        正式供应商
        <el-row>
            <el-col>
                <el-input v-model="keywords"></el-input>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {defineComponent}from 'vue';
export default defineComponent({
    data(){
        return {
            keywords: ''
        }
    }
});
</script>