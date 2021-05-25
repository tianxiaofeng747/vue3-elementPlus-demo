<template>
    <div class="app-wrapper" :class="{ closeSidebar: !isOpean, hideSidebar: isHide }">
        <div class="content">
            <level-header ></level-header>
            <div class="section">
                <Menu class="sidebar-container menu" :hideSidebar="isHide"></Menu>
                <div class="collapse">
                    <img class="pointer" :src="isHide ? CloseImg : OpenImg" alt="" @click="isHide = !isHide" />
                </div>
                <div class="content" :class="{ close: !isOpean}">
                    <div class="main-container" ref="mainContainer">
                        <div class="main-nav">
                            <TabsNav></TabsNav>
                            <!-- <div class="main-tips">
                                <Prompt :isShow.sync="isPageTips">
                                    <div v-html="pageTips"></div>
                                </Prompt>
                            </div> -->
                        </div>
                        <div class="main-content">
                            <Dashboard></Dashboard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Menu from './Menu.vue';
import Prompt from './Prompt.vue';
import LevelHeader from './LevelHeader.vue';
import Dashboard from './Dashboard.vue';
import TabsNav from './TabsNav.vue';
import { mapGetters } from 'vuex';
import OpenImg from "@/assets/images/1.jpg";
import CloseImg from "@/assets/images/2.jpg";

export default {
    name: 'layout',
    data() {
        return {
            OpenImg,
            CloseImg,
            isHide: false,
            pageTips: '',
            isPageTips: false
        };
    },
    components: {
        Menu,
        LevelHeader,
        Dashboard,
        Prompt,
        TabsNav
    },
    methods: {
        
    },
    created() {
    },
    computed: {
        ...mapGetters([
            'isOpean'
        ]),
        pageCode() {
            return this.$route.meta.componentUrl || this.$route.name;
        },
        funcNo() {
            return this.$route.meta.no || this.$route.query.funcNo;
        }
    }
};

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
    padding-left: 10px;
    box-sizing: border-box;
}

html,
body,
.app-wrapper {
    overflow: hidden;

    &.closeSidebar {
        .sidebar-container {
            width: $menu-close-width;
            overflow: inherit;
        }

        .section {
            .collapse {
                left: $menu-close-width;
            }
        }
    }

    &.hideSidebar {
        .sidebar-container {
            width: 0;
            overflow: hidden;
        }

        .section {
            .collapse {
                left: 0px;
            }

            .content,
            .content.close {
                margin-left: 0px;
            }
        }
    }

    .app-wrapper {
        width: 100%;
        height: 100%;
    }

    .section {
        position: relative;

        .collapse {
            left: $menu-width;
            position: absolute;
            top: 50%;
            margin-top: -18px;
            opacity: 0.2;
        }

        .menu {
            position: fixed;
            top: $header-height;
            left: 0;
            z-index: 99;
        }

        .content {
            margin-left: $menu-width;

            &.close {
                margin-left: $menu-close-width;
            }

            &.fullScreen {
                margin-left: 0;
            }

            .main-nav {
                min-height: 36px;
                // padding: 0 5px;
                padding-left: 10px;

                .main-tips {
                    position: relative;
                    top: -5px;
                }
            }

            .main-content {
                height: calc(100vh - 90px);
                overflow: auto;
                // border: 1px solid $border-color;
                // margin: 0 5px;
                @include scrollBar;

                &.fullScreen {
                    height: 100vh;
                }
            }
        }
    }
}

</style>
