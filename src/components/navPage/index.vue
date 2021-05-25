<template>
    <section class="container_setion">
        <el-alert type="warning">
            <div slot="title">
                点击卡片，即可进入相应菜单
            </div>
        </el-alert>
        <div class="box" style="padding-top: 10px;">
            <div class="yl-info sl-rows" v-for="item in list" :key="item.name">
                <div class="yl-info-tt">
                    <router-link :to="item.path">
                        <h3 v-text="item.meta.name"></h3>
                    </router-link>
                </div>
                <el-row class="sl-row">
                    <el-col class="sl-col" v-for="data in item.children" :key="data.name" :md="6" :xl="4">
                        <div class="sl-block">
                            <div class="s-block-left" :class="item.class">
                                <i class="el-icon-caret-right"></i>
                                <!-- <router-link :to="data.path">
                                   <yl-icon class="sl-block-icon" icon=""></yl-icon>
                                </router-link> -->
                            </div>
                            <div class="title">
                                <router-link :to="data.path">
                                    <span v-text="data.meta.name"></span>
                                </router-link>
                            </div>
                            <!-- <div class="collect" :class="{ 'checked': data.isCollect}" @click="setCollect(data)">
                                <yl-icon className="icon-star_full"></yl-icon>
                            </div> -->
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </section>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
const URL = {
    save: 'ddc.uim.employeFavourFunc.save' // 保存，取消常用
};
export default {
    name: 'NavPage',
    data () {
        return {
            search: {},
            list: []
        };
    },
    computed: {
        ...mapGetters(['menuList', 'userInfo', 'collectList']),
        collects () {
            return this.collectList.map(item => item.id);
        }
    },
    components: {},
    props: {
        navs: {
            type: Array,
            // required: true,
            default () {
                return [];
            }
        }
    },
    watch: {
        $route (form, to) {
            this.init();
        },
        collectList () {
            this.init();
        }
    },
    methods: {
        ...mapActions(['getCollectList']),
        _execMenu (list) {
            let result = list.map((item, index) => {
                item.isCollect = this.collects.includes(item.no);
                item.class = 'theme_' + (2 - index % 2);
                item.children && (item.children = this._execMenu(item.children));
                return item;
            });
            return result;
        },
        init () {
            let no = this.$route.meta.no;
            this.list = [];
            
            this.menuList.forEach(item => {
                item.children.forEach(data => {
                    if (data.meta.no === no) {
                        this.list = this._execMenu(data.children);
                    }
                });
            });
            console.log(no, this.list);
        },
        // 设置收藏
        setCollect (item) {
            this.Http(URL.save, {
                params: {
                    employeeNo: this.userInfo.employerNo,
                    enterpriseNo: this.userInfo.enterpriseNo,
                    releaseNo: item.releaseNo,
                    relasePermissionNo: item.no
                }
            }).then(result => {
                this.$message.success('设置成功');
                this.getCollectList(item.releaseNo).then(result => {
                    this.init();
                });
            });
        }
    },
    created () {
        this.init();
    }
};

</script>

<style lang="scss" scoped>
    .sl-rows{
        border:none;
        > h3{
            color: $theam;
            line-height: 30px;
            padding-top: 15px;
            margin-bottom: 5px;
            font-weight: normal;
            font-size: 16px;
        }
        .sl-row{
            padding-top: 15px;
        }
        .sl-col {
            .sl-block{
                display: flex;
                margin-bottom: 1em;
                margin-right: 1em;
                padding: 0.57em 0 0.57em 0.57em;
                border-radius: 3px;
                border: 1px solid #d6e2de;
                align-items: center;
                position: relative;
                a{
                    color: #666;
                    &:hover{
                        color: $theam;
                    }
                }
                .s-block-left{
                    padding: 5px;
                    /*&.theme_0 {
                        background-color: #d89935;
                    }
                    &.theme_1 {
                        background-color: #2C9CEA;
                    }
                    &.theme_2 {
                        background-color: #3aa13e;
                    }*/
                    .sl-block-icon{
                        font-size: 32px;
                        color: $theam;
                    }
                }
                .title{
                    font-size: 15px;
                    flex-grow: 1;
                    color: #666;
                }
                .collect{
                    width: 20px;
                    cursor: pointer;
                    position: absolute;
                    right: 5px;
                    top:5px;
                    font-size: 16px;
                    color: #ccc;
                    &.checked{
                        color: $theam;
                    }
                }
            }
        }
    }
</style>
