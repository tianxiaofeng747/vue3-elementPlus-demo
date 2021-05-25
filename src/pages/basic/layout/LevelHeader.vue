<template>
    <div class="header-main">
        <div class="container">
            <div class="c-left">
                <div class="logo" :class="{'close':!isOpean}">
                    <div @click="handleToHello" class="pointer">
                        <!-- <img :src="enterpriseLogo" alt="" class="sysName"> -->
                        <!-- <img :src="enterpriseLogo" alt="" class="sysName"> -->
                        <img v-if="isOpean" :src="Logo1" alt="" class="sysName">
                        <img v-else :src="Logo2" alt="" class="sysName2">
                    </div>
                    <!-- <div class="shrink" @click="toggleMenu">
                    <yl-icon icon="icon-title-shouqi" class="svg"></yl-icon>
                </div> -->
                </div>
                <div class="c-left-menu" ref="leftMenu">
                    <template v-if="maxMove > 0">
                        <div class="c-left-arrow arrowL" @click="moveMenu('left')">
                            <i class="el-icon-arrow-left"></i>
                        </div>
                        <div class="c-left-arrow arrowR" @click="moveMenu('right')">
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </template>
                    <div class="c-left-menu-body">
                        <ul class="products" :style="{marginLeft: moveNum + 'px'}" ref="leftMenuBody">
                            <li :class="{'active': activeNo == item.no}" @click="handleChangeMenu(item)" v-for="(item, index) in menuList" :key="index">
                                <yl-icon :className="item.funcIcon" v-if="item.funcIcon"></yl-icon>
                                <span v-text="item.label"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="c-right">
                <ul>
                    <!-- <li>
                    <el-badge :value="unreadCount > 0 ? unreadCount : ''" :max="100">
                        <yl-icon icon="icon-xiaoxi1" style="font-size: 16px; padding-right: 5px; vertical-align: middle;"></yl-icon>
                        <el-button type="text" @click="handleMessage">
                            消息
                        </el-button>
                    </el-badge>
                </li> -->
                    <li>
                        <p @click="handleUserRoleChange">{{userInfo.tenantDeptName}}</p>
                    </li>
                </ul>
                <div class="helps" v-if="list.length > 1">
                    <el-dropdown @command="changeSystem" trigger="hover">
                        <div class="el-dropdown-link">
                            <yl-icon class="svg" className="icon-zhihuan"></yl-icon>
                            <span>切换角色</span>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="item" v-for="(item, index) in list" :disabled="!item.canSwitch" :key="index">{{item.enterpriseName}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="userinfo-inner" :class="{active: isLogoActive}">
                    <el-dropdown @command="handleCommand" trigger="click" @visible-change="visibleChange" placement="bottom">
                        <div class="user-logo">
                            <img :src="userLogo" alt="" />
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="user">
                                    <div class="line" style="line-height: 22px; padding-bottom: 5px;">
                                        <h4>
                                            <yl-icon icon="icon-gerenxinxi" class="icon"></yl-icon> {{userInfo.username}}
                                        </h4>
                                        <p style="color: #999; font-size: 12px;">账号: {{userInfo.username}}</p>
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item command="exit">
                                    <el-button size="mini">退出</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <UserMsg v-if="isUserMsg" v-model:show="isUserMsg" :type="typeMsg" :userInfo="userInfo" :defaultUrl="defaultUrl"></UserMsg>
    </div>
</template>
<script>
import enterpriseLogo from './img/logo.png';
import Logo1 from './img/logo.png';
import Logo2 from './img/logo3.png';
import userLogo from '@/assets/images/logo.png';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Tools from '@/utils/customer/global.js';
import BASE from '@/utils/constant/index.js';
import { debounce } from 'lodash';
import UserMsg from "@/pages/basic/login/mods/userMsg.vue";

const URL = {
    getFileUrl: 'scs.file.fileTemplate.getFileUrl', // 下载模板
    USER_INFO: 'ypt.user.findUserByNo', // 获取用户详情
    changeEnterprise: 'ddc.uim.authorizationPermission.getEmployeePartPermission'
}; // 文件格式
export default {
    //mixins: [linkTo],
    data() {
        return {
            defaultUrl: BASE.defaultUrl,
            isLogoActive: false,
            logo: '',
            userLogo,
            enterpriseLogo,
            Logo1,
            Logo2,
            activeNo: '',
            list: [],
            maxMove: 0,
            moveNum: 0,
            isUserMsg: false,
            typeMsg: 'header'
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'menuList',
            'isOpean',
            'unreadCount'
        ])
    },
    watch: {
        $route() {
            this.setCurrentMenu();
        },
        userInfo: {
            deep: true,
            handler: function(val) {
                this.setUser();
            }
        }
    },
    methods: {
        ...mapMutations(['SEFLEFTMENU', 'SETTEMPNAVS']),
        ...mapActions(['logout', 'getCollectList', 'getUnreadMessageCount']),
        toggleMenu() {
            this.$store.commit('TOGGLE_SIDEBAR');
        },
        // 移动菜单
        moveMenu(orientation) {
            if (orientation === 'left') {
                this.moveNum += 200;
                this.moveNum = Math.min(0, this.moveNum);
            } else {
                this.moveNum -= 200;
                this.moveNum = Math.max(0 - this.maxMove, this.moveNum);
            }
        },
        handleToHello() {
            this.$router.push('/app/hello');
        },
        // 切换产品
        changeSystem(item) {
            this.Http(URL.changeEnterprise, {
                enterpriseNo: item.enterpriseNo,
                userNo: item.userNo
            }).then(result => {
                // let data = result.data || [];
                this.SETTEMPNAVS([]);
                sessionStorage.clear();
                window.location.href = BASE.defaultUrl;
            });
        },
        // 切换左侧菜单
        handleChangeMenu(item) {
            this.activeNo = item.no;
            this.SEFLEFTMENU(item.children);
            // this.getCollectList(item.releaseNo);
        },
        visibleChange(visible) {
            this.isLogoActive = visible;
        },
        handleHelp() {
            let enterpriseType = this.$store.getters.userInfo.enterpriseType; // 判断用户类型
            let nameDoc = '';
            if (enterpriseType.includes('jxs')) {
                nameDoc = 'Distributor_Manual';
            } else if (enterpriseType.includes('cs')) {
                nameDoc = 'Manufacturer_Manual';
            } else {
                nameDoc = 'Hospital_end_Manual';
            }
            // Distributor_Manual       经销商操作手册
            // Hospital_end_Manual      医院端操作手册
            // Manufacturer_Manual      生产厂商操作手册
            this.Http(URL.getFileUrl, {
                token: nameDoc
            }).then(res => {
                Tools.downloadFile(Tools.mode.IMAGE_DOWNLOAD + res.data.url);
            });
        },
        handleCommand(type) {
            if (type === 'exit') {
                this.exit();
            } else if (type === 'help') {
                this.handleHelp();
            } else if (type === 'enterprise') {
                let url = 'basic/enterprise/info';
                this.handleLinkTo(url);
            } else if (type === 'user') {
                this.$router.push({
                    name: 'myAccount'
                });
            }
        },
        setUser() {
            let data = this.userInfo,
                avator = data.enterpriseLogo || '';
            //this.userLogo = avator ? Tools.formatFile(avator) : userLogo; // 头像
        },
        /** 退出登 */
        exit() {
            this.$confirm('确认退出该系统吗？', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                let params = {};
                params.Authorization = 'bearer ' + this.userInfo.access_token;
                this.logout(params).then(result => {
                    sessionStorage.removeItem('vuex');
                    window.location.href = '/login';
                });
            });
        },
        // 消息列表
        handleMessage() {
            this.handleLinkTo('message/list', {
                unread: 1
            });
        },
        // 切换
        handleUserRoleChange() {
            this.isUserMsg = true;
        },
        setCurrentMenu() {
            // let currentItem = this.menuList.find(
            //     item => ~this.$route.path.indexOf(item.funcUrl)
            // );
            // this.handleChangeMenu(currentItem || this.menuList[0]);
        },
        countMoveLength() {
            this.moveNum = 0;
            this.maxMove = this.$refs.leftMenuBody.offsetWidth - this.$refs.leftMenu.offsetWidth + 40;
        }
    },
    mounted() {
        const debounceFunc = debounce(this.countMoveLength.bind(this), 500);
        window.addEventListener('resize', debounceFunc);
        this.countMoveLength();
    },
    created() {
        this.setUser();
        // this.getList();
        console.log(this.menuList)
        if (this.menuList && this.menuList.length) {
            this.menuList.forEach(item => {
                if (item.path.includes('/scm')) {
                    item.funcIcon = 'icon-SCM';
                } else if (item.path.includes('/openLink')) {
                    item.funcIcon = 'icon-juhelianjie';
                } else if (item.path.includes('/ddm')) {
                    item.funcIcon = 'icon-DDM';
                }
                return item;
            });
            this.setCurrentMenu();
        }
        // 轮询
        // this.getUnreadMessageCount();// 初始
    },
    components: {
        UserMsg
    }
};

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@media screen and (max-width: 1500px) {
    .enterpriseName {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // width: 70px;
    }
}

:deep .el-badge__content.is-fixed {
    top: 14px;
}

:deep .popper__arrow {
    display: none !important;
}

:deep .line {
    border-bottom: 1px solid #d8e2ec;
    min-width: 130px;
    padding: 0 10px;

    .icon {
        color: #95acca;
        padding-right: 3px;
    }

    &:hover .icon {
        color: $theam;
    }
}

:deep .exit {
    padding-top: 5px;
    text-align: right;
}

.el-dropdown-menu {
    padding: 10px 0;
}

:deep .el-dropdown-menu__item {
    padding: 0 12px;
}

:deep .el-dropdown-menu__item:not(.is-disabled):hover,
.el-dropdown-menu__item:focus {
    background-color: transparent;
}

.container {
    height: $header-height;
    // background-color: $theam;
    // background: linear-gradient(to right, #038b8d, #1093b4);
    background: $theam;
    color: #fff;
    font-size: 16px;
    @include flex(space-between);

    .c-left {
        height: 100%;
        width: calc(100% - 350px);
        @include flex(flex-start);

        .logo {
            width: $menu-width;
            // padding: 0 10px;
            box-sizing: border-box;
            @include flex(space-between, center);
            height: 100%;
            overflow: hidden;

            &.close {
                @include flex;
                width: $menu-close-width;

                .sysName {
                    display: none;
                }

                .sysName2 {
                    display: block;
                }

                .shrink {
                    margin-left: 0;
                }
            }

            // .sysName {
            //     // height: 23px;
            //     // margin: 4px auto 0;
            // }
            // .sysName2 {
            //     // height: 18px;
            // }
            .shrink {
                margin-left: 10px;
                padding: 6px 8px;
                background: $header-active-color;
                cursor: pointer;

                .svg {
                    width: 12px;
                    height: 12px;
                }
            }
        }

        .c-left-menu {
            position: relative;
            width: calc(100% - 100px);
            padding: 0 20px;
            overflow: hidden;

            .c-left-arrow {
                font-size: 24px;
                color: #fff;
                border-radius: 5px;
                position: absolute;
                top: 8px;
                cursor: pointer;
                z-index: 100;

                &:hover {
                    // color: goldenrod;
                    background-color: rgba(0, 0, 0, .2);
                }

                &.arrowL {
                    left: 0;
                }

                &.arrowR {
                    right: 0;
                }
            }

            &-body {
                width: 2000px;
            }
        }

        .products {
            display: table;
            height: 100%;
            transition: all ease 0.3s;

            &>li {
                float: left;
                height: 100%;
                padding: 0 10px;
                line-height: 50px;
                cursor: pointer;

                .yl-icon {
                    width: 18px;
                    height: 18px;
                    vertical-align: -3px;
                }

                &:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }

                &.active {
                    background-color: rgba(0, 0, 0, 0.1);
                }

                span {
                    margin-left: 10px;
                }
            }
        }
    }

    .c-right {
        font-size: 14px;
        height: 100%;
        flex-shrink: 0;
        @include flex(flex-start);

        :deep .el-dropdown {
            color: #fff;
            cursor: pointer;
        }

        &-search {
            .yl-icon {
                width: 20px;
                height: 20px;
                cursor: pointer;
                vertical-align: -5px;
            }
        }

        ul {
            display: flex;

            li {
                line-height: $header-height;
                padding: 0 5px;
                cursor: pointer;

                :deep .el-button--text {
                    color: #fff;
                }
            }
        }

        .userinfo-inner {
            height: $header-height;
            padding-right: 20px;
            padding-left: 10px;

            &.active {
                background-color: rgba(0, 0, 0, 0.1);
            }

            @include flex(flex-start);

            .user-logo {
                display: block;
                height: 36px;
                width: 36px;
                background-color: #fff;
                margin-left: 10px;
                border-radius: 3px;
                box-sizing: border-box;
                padding: 2px;

                img {
                    border-radius: 3px;
                    width: 100%;
                    height: 100%;
                    box-shadow: 0px 0px 1px #666;
                }
            }
        }

        .helps {
            @include flex(flex-start);

            &>li {
                cursor: pointer;
                margin-right: 20px;

                .svg {
                    height: 18px;
                    width: 18px;
                    margin-right: 5px;
                }
            }
        }

        .logout {
            .svg {
                cursor: pointer;
                height: 25px;
                width: 25px;
                margin-right: 20px;
            }
        }
    }
}

.lock-bg {
    widows: 0;
    height: 0;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 200;

    .lock-con {
        z-index: 2;
        position: absolute;
        text-align: center;
        width: 380px;
        height: 380px;
        left: 50%;
        top: 50%;
        margin-top: -190px;
        margin-left: -190px;
        color: #fff;
        font-size: 20px;
        opacity: 0;
        visibility: hidden;

        img {
            border-radius: 10px;
        }

        p {
            line-height: 40px;
        }
    }

    .lock-bg-c {
        width: 100%;
        height: 0;
        position: fixed;
        left: 0;
        z-index: 1;
        transition: height 0.7s;
    }

    .lock-bg-t {
        top: 0;
        background: #3a3a3a;
    }

    .lock-bg-b {
        background: #3a3a3a;
        bottom: 0;
    }

    &.close {
        width: 100%;
        height: 100%;

        .lock-bg-c {
            height: 50%;
        }

        .lock-con {
            transition-delay: 0.7s;
            visibility: visible;
            opacity: 1;
        }
    }
}

</style>
