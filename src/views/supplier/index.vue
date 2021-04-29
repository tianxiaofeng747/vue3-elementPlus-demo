<!--
 * @Author: jinqing
 * @Date: 2021-04-28 10:48:41
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-29 16:50:13
 * @Description: file content
-->
<template>
    <yl-table :data="list">
        <el-table-column prop="indexX" label="序号"></el-table-column>
        <el-table-column prop="sourceFuncName" label="来源单据" show-overflow-tooltip>
            <template #default="scope">
                {{scope.row.sourceFuncName}}
            </template>
        </el-table-column>
        <el-table-column prop="targetFuncName" label="目标单据" show-overflow-tooltip></el-table-column>
    </yl-table>
</template>
<script lang="ts">
import { defineComponent, h } from 'vue';
export default defineComponent({
    data() {
        return {
            list: [
                {
                    indexX: 1,
                    sourceFuncName: '55',
                    targetFuncName: '66'
                },
                {
                    indexX: 2,
                    sourceFuncName: '77',
                    targetFuncName: '88'
                }
            ]
        };
    },
    components:{
    },
    setup() {
        const renderXhao = () =>{
            return '<div>xh</div>'
        }
        return {
            renderXhao
        }
    },
});
</script>