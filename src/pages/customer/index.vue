<!--
 * @Author: jinqing
 * @Date: 2021-04-23 15:44:09
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-25 09:58:19
 * @Description: file content
-->
<template>
    <div>
        <SelectCustomer v-if="isShow" v-model:show="isShow" @update="setCustomer"></SelectCustomer>
        <el-form :inline="true" v-model="form">
            <el-form-item label="客户">
                <el-input v-model="form.names"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="selectKh">选择</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts">
import {ref, defineComponent} from 'vue';
import SelectCustomer from './mods/selectCustomer.vue';
export default defineComponent({
    setup: () => {
        const isShow = ref(false);
        const form = ref({
            name: ''
        });
        const selectKh = () => {
            isShow.value = true;
        }
        const setCustomer = (list) =>{
            console.log(list);
        }
        return {
            isShow,
            form,
            selectKh,
            setCustomer
        }
    },
    components:{
        SelectCustomer
    }
})
</script>