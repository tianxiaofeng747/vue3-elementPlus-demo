<template>
    <div class="tabs-nav">
        <!-- v-contextmenu:contextmenu -->
        <el-tabs v-model="activeName" type="card"  @tab-remove="removeTab" >
            <el-tab-pane :key="item.name" v-for="item in tempNavs" :label="item.label" :name="item.name" :closable="item.closeable">
                <span slot="label"> <yl-icon class="tabs-tip" className="icon-chanpinzhongxin" v-if="item.meta.leval === 2"></yl-icon> {{item.label}}</span>
            </el-tab-pane>
        </el-tabs>
        <v-contextmenu ref="contextmenu">
            <v-contextmenu-item @click="removeAll()">关闭其他</v-contextmenu-item>
            <v-contextmenu-item @click="removeAll(true)">关闭全部</v-contextmenu-item>
        </v-contextmenu>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import BASE from '@/utils/constant/index.js';
export default {
    data () {
        return {
            disabledTabs: ['/app/hello'],
            activeName: ''
        };
    },
    computed: {
        ...mapGetters(['tempNavs', 'activeNav'])
    },
    watch: {
        activeNav (val) {
            this.activeName = val;
        },
        activeName (val) {
            let temp = this.tempNavs.filter(item => item.name === val)[0] || {};
            if (val && this.$route.name !== val) {
                this.$router.push({
                    name: val,
                    query: temp.query,
                    params: temp.params
                });
                this.SETACTIVENAV(val);
            }
        },
        $route () {
            this.addViewTags();
        }
    },
    methods: {
        ...mapMutations(['SETACTIVENAV', 'REMOVENAV', 'SETTEMPNAVS']),
        removeAll (isAll = false) {
            let otherMenu = this.tempNavs.filter(item => item.name === this.activeName || item.closeable === false);
            let homeMenu = this.tempNavs.filter(item => item.closeable === false);
            if (isAll) {
                this.SETTEMPNAVS(homeMenu);
                this.$router.push(BASE.defaultUrl);
            } else {
                this.SETTEMPNAVS(otherMenu);
            }
        },
        removeTab (val) {
            this.REMOVENAV({
                closeName: val
            });
        },
        generateRoute () {
            if (this.$route.name) {
                return this.$route;
            }
            return false;
        },
        addViewTags () {
            const route = this.generateRoute();
            if (!route) {
                return false;
            }
            let label = route.query.label || route.meta.name;
            this.SETTEMPNAVS({ name: route.name, label: label, query: route.query, params: route.params, meta: route.meta, closeable: !this.disabledTabs.includes(route.path) });
        }
    },
    mounted () {
        this.activeName = this.activeNav;
        this.addViewTags();
    }
};
</script>

<style lang="scss" scoped>
.tabs-nav {
    padding: #{$mg-min-size}px 0 0 0;
    // margin-right: 120px;
    :deep .el-tabs__item {
        height: 30px;
        line-height: 30px;
    }
    :deep .el-tabs--card > .el-tabs__header,
    :deep .el-tabs--card > .el-tabs__header .el-tabs__item,
    :deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border-color: $border-color;
    }
    :deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        border-bottom-color: $theam;
        color: $theam;
        background-color: $body-bg;
        border-bottom-width: 2px;
    }
    :deep .el-tabs__header {
        margin-bottom: 0px;
    }
    .tabs-tip {
        position: absolute;
        left: 0;
        opacity: 0.6;
        transform-origin: 0 0;
    }
}
</style>
