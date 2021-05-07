<template>
    <el-dialog title="表格设置"  v-model="shows" width="960px"  append-to-body>
        <div>
            <el-row :gutter="10">
                <el-col :span="21">
                    <el-table :data="list" style="width: 100%" border ref="tableRow" :max-height="maxHeight" stripe header-row-class-name="table-header">
                        <el-table-column label="选择" width="60" align="center">
                            <template #default="scope">
                                <el-radio :disabled="scope.row.fixed || !scope.row.isShow" v-model="currentIndex" :label="scope.row.index"></el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="列名"></el-table-column>
                        <el-table-column label="显示名称" v-if="isEditName">
                            <template #default="scope">
                                <el-input v-model="scope.row.label" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="宽度" width="130">
                            <template #default="scope">
                                <el-input-number v-model="scope.row.width" size="small" :controls="false" class="w100" :min="50"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="对齐方式" width="130">
                            <template #default="scope">
                                <el-select v-model="scope.row.align" size="small" placeholder="请选择">
                                    <el-option label="左对齐" value="left"></el-option>
                                    <el-option label="局中" value="center"></el-option>
                                    <el-option label="右对齐" value="right"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="显示" width="80" align="center">
                            <template #default="scope">
                                <!-- isMastShow 是否强制显示 -->
                                <el-switch v-if="scope.row.isMastShow" v-model="scope.row.isShow" disabled size="small"></el-switch>
                                <el-switch v-else v-model="scope.row.isShow" :disabled="scope.row.totalRow" size="small"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="左锁列" width="70" align="center">
                            <template #default="scope">
                                <el-checkbox v-model="scope.row.leftFixed" @change="changeFixed(scope.row, 'left')" :disabled="!scope.row.isShow "></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="右锁列" width="70" align="center">
                            <template #default="scope">
                                <el-checkbox v-model="scope.row.rightFixed" @change="changeFixed(scope.row, 'right')" :disabled="!scope.row.isShow"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="3">
                    <div class="right-btn">
                        <p class="text-center mgb10">
                            <el-button size="mini" @click="up">上移</el-button>
                        </p>
                        <p class="text-center mgb10">
                            <el-button size="mini" @click="down">下移</el-button>
                        </p>
                        <p class="text-center mgb10">
                            <el-button size="mini" @click="reset">还原默认值</el-button>
                        </p>
                    </div>
                </el-col>
            </el-row>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="shows = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
export default defineComponent({
    data () {
        return {
            maxHeight: null,
            fixed: -1,
            currentIndex: null,
            list: []
        };
    },
    props: {
        isShow: {
            type: Boolean,
            required: true
        },
        // 远程保存的col， 如果远程没保存，就用页面的col 数据
        columns: {
            type: Array,
            required: true
        },
        // 页面定义的col 数据
        sourceColumns: {
            type: Array,
            required: true
        },
        // 是否可以修改列名称
        isEditName: {
            type: Boolean,
            required: true
        }
    },
    created () {
        this.list = this.initColumns(this.columns);
        console.log(this.columns);
        this.setHeigth();
    },
    methods: {
        initColumns (list) {
            let res:any = [],
                i = 0;
            list.forEach((item, index) => {
                item.sortIndex = index + 1;
                if (!item.unSet) {
                    item.index = i; // 编号
                    item.sourceIndex =
                        typeof item.sourceIndex === 'number'
                            ? item.sourceIndex
                            : i; // 源编号.方便重置
                    item.name = item.name || item.label; // 名称
                    // item.fixed && (this.fixed = item.index); // 锁列
                    item.isShow = !item.isHide; // 是否显示
                    item.leftFixed = item.fixed === 'left' || item.fixed === true;
                    item.rightFixed = item.fixed === 'right';
                    res.push(item);
                    i++;
                }
            });
            return JSON.parse(JSON.stringify(res));
        },
        setHeigth () {
            let height = window.innerHeight,
                maxH;
            if (height > 900) {
                maxH = 600;
            } else if (height > 800) {
                maxH = 500;
            } else if (height > 700) {
                maxH = 400;
            } else {
                maxH = 350;
            }
            this.maxHeight = maxH;
        },
        // 锁列改变
        changeFixed (row, type) {
            if (type === 'right' && row.rightFixed) {
                row.leftFixed = false;
            }
            if (type === 'left' && row.leftFixed) {
                row.rightFixed = false;
            }
        },
        submit () {
            this.list.forEach(item => {
                item.isHide = !item.isShow;
                delete item.isShow;
                if (item.leftFixed) {
                    item.fixed = 'left';
                } else if (item.rightFixed) {
                    item.fixed = 'right';
                } else {
                    item.fixed = false;
                }
                if(!item.width){
                    item.width = undefined;
                }
            });
            let config = this.columns
                .filter(item => item.unSet)
                .concat(this.list);
            config.sort((a, b) => {
                if (!a.unSet && !b.unSet) {
                    return a.index - b.index;
                } else {
                    return a.sortIndex - b.sortIndex;
                }
            });
            this.$emit('change', config);
            this.shows = false;
        },
        // 逻辑： 已经锁列的是不能上下移动的
        up () {
            if (this.currentIndex > 0) {
                let target = this.currentIndex - 1;
                this.list[target].index = target + 1;
                this.list[target + 1].index = target;
                this.list[target] = this.list.splice(
                    target + 1,
                    1,
                    this.list[target]
                )[0];
                this.currentIndex = target;
            }
        },
        down () {
            if (
                this.currentIndex < this.list.length - 1
            ) {
                let target = this.currentIndex + 1;
                this.list[target].index = target - 1;
                this.list[target - 1].index = target;
                this.list[target] = this.list.splice(
                    target - 1,
                    1,
                    this.list[target]
                )[0];
                this.currentIndex = target;
            }
        },
        reset () {
            let columns = this.initColumns(this.sourceColumns);
            columns.sort((a, b) => a.sourceIndex - b.sourceIndex);
            columns.forEach(item => {
                item.isShow = true;
            });
            this.list = columns;
            this.list.forEach((item, index) => {
                item.label = item.name;
                item.index = index;
            });
            this.currentIndex = null;
        }
    },
    emits: ['updateShow', 'change'],
    computed: {
        shows: {
            get () {
                return this.isShow;
            },
            set (newValue:boolean) {
                this.$emit('updateShow', newValue); // 更新父组件shows
            }
        }
    }
});
</script>
