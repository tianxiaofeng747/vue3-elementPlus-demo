<template>
    <div class="login-content">
        <div class="login-main">
            <div class="login-form">
                <div class="form-logo">
                    <img src="./img/logobig.png" alt="" />
                </div>
                <h1 class="form-title">
                    <p class="system-name">
                        <strong>医院供应链系统</strong>
                        <span class="version">{{ systemVersion }}</span>
                        <span class="hostpital-name">{{ hostpitalName }}</span>
                    </p>
                </h1>
                <div class="form-content">
                    <div class="showinfo">
                        <strong class="tip" v-if="!errorMsg.length">请在安全网络下登录账户</strong>
                        <div class="errorMsg" v-if="errorMsg.length">
                            <i class="el-icon el-icon-warning"></i>
                            <p class="error" v-text="errorMsg"></p>
                        </div>
                    </div>
                    <el-form ref="form" :model="form">
                        <el-form-item>
                            <el-input placeholder="请输入用户名/手机号/邮箱" v-model.trim="form.username" @keyup.enter.native="login">
                                <yl-icon icon="icon-denglu-1" slot="prefix" class="icons"></yl-icon>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input placeholder="请输入密码" v-model.trim="form.password" type="password" @keyup.enter.native="login">
                                <yl-icon icon="icon-denglu-" slot="prefix" class="icons"></yl-icon>
                            </el-input>
                        </el-form-item>
                        <!-- <el-form-item class="custom-mgb">
                            <el-col :span="11">
                                <el-input
                                    placeholder="验证码"
                                    v-model.trim="form.verifycode"
                                    :maxlength="4"
                                    @keyup.enter.native="login"
                                ></el-input>
                            </el-col>
                            <el-col :span="13" class="verifyimg">
                                <img
                                    id="imageCode"
                                    class="textbox"
                                    :src="verifyImg"
                                    width="80"
                                    height="40"
                                    alt="验证码"
                                    @click="refreshCode()"
                                    title="点击刷新"
                                />
                                <a
                                    title="点击刷新"
                                    @click="refreshCode()"
                                    href="javascript:void(0)"
                                    >换一张？</a
                                >
                            </el-col>
                        </el-form-item> -->
                        <el-form-item class="submit">
                            <el-button type="primary" @click="login">立即登录</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="appDownload-text">
                        <span @mouseover="showAppDownload" @mouseout="hideAppDownload">
                            供应链APP下载
                        </span>
                    </div>
                    <div class="copyright">
                        版权所有 © 杭州云医购网络科技有限公司
                    </div>
                    <div class="appDownload" v-if="showCode">
                        <img src="./img/appDownload.jpg" />
                    </div>
                </div>
            </div>
        </div>
        <update-browder v-if="showUpdatebrowser"></update-browder>
        <div v-if="showForget">
            <ForgetPassWord :show.sync="showForget"></ForgetPassWord>
        </div>
        <UserMsg v-if="isUserMsg" :show.sync="isUserMsg" :type="typeMsg" :userInfo="userInfo" :defaultUrl="defaultUrl"></UserMsg>
    </div>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from "vuex";
import BASE from "@/utils/constant/index.js";
import UpdateBrowder from "./mods/browserVersion.vue";
import ForgetPassWord from "./mods/forgetPassWord.vue";
import UserMsg from "./mods/userMsg.vue";
import { Base64 } from 'js-base64';

const URL = {
    VERIFY_CODE: "/verifyCode",
    status: "yhlo.brp.enterprise.getEnterpriseStatus"
};
export default {
    data() {
        return {
            defaultUrl: BASE.defaultUrl,
            evs: process.env.NODE_ENV, // 环境
            showUpdatebrowser: false,
            showForget: false,
            verifyImg: "",
            errorMsg: "",
            form: {
                username: "",
                password: "",
                verifycode: ""
            },
            isUserMsg: false,
            showCode: false,
            systemVersion: "1.0.0",
            hostpitalName: "浙江第一人民医院",
            typeMsg: 'login'
        };
    },
    computed: {
        ...mapGetters(["userInfo", "routers"])
    },
    methods: {
        ...mapActions({
            userLogin: "login",
            // currentUser: "currentUser",
            getroles: "getroles"
        }),
        // 检测浏览器的版本
        checkBrowserVersion() {
            let ua = navigator.userAgent;
            let isIE = ua.indexOf("compatible") > -1 && ua.indexOf("MSIE") > -1; // 判断是否ie浏览器 除(ie11和edge)
            if (isIE) {
                let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(ua);
                let fIEVersion = parseFloat(RegExp.$1);
                if (fIEVersion < 10) {
                    this.showUpdatebrowser = true;
                }
            }
        },
        // 记住用户名
        rememberUser() {
            if (this.form.username) {
                localStorage.setItem("username", this.form.username);
            }
        },
        // 获取用户名
        getUser() {
            let name = localStorage.getItem("username");
            name && (this.form.username = name.trim());
        },
        // 刷新验证码
        getRandomImg() {
            /*this.form.verifycode = "";
            this.verifyImg =
                "/gateway" +
                URL.VERIFY_CODE +
                "?t=" +
                Math.round(Math.random() * 1000000);*/
        },
        // 获取用户信息
        refreshCode() {
            this.getRandomImg();
            /*if (this.userInfo && this.userInfo.token) {
                this.getRandomImg(); // 通过验证码获取token
                return Promise.resolve();
            } else {
                return this.currentUser().then(
                    () => {
                        this.getRandomImg();
                    },
                    () => {
                        this.getRandomImg();
                    }
                );
            }*/
        },

        // 判断用户多个角色进行切换
        getUserRoleChange(res) {
            if (res.data.currentUserList && res.data.currentUserList.length > 1) {
                this.isUserMsg = true;
            } else {
                let userInfo = this.$store.getters.userInfo;
                userInfo.currentUser = res.data.currentUserList[0];
                this.$store.commit('CHANGEUSER', userInfo);
                this.$router.push(this.defaultUrl);
            }
            /*this.Http(URL.status, {}).then(res => {
                let data = res.data;
                if (data === "audited" || data === "imported") {
                    this.$router.push(this.defaultUrl);
                } else if (data === "unaudit") {
                    // 为认证的跳转到认证页面
                    this.$router.push({
                        name: "perfectRegister"
                    });
                } else {
                    this.$message({
                        message: "该企业已被注销，无法登录,请联系管理员",
                        type: "warning"
                    });
                }
            });*/
        },

        // 登录
        login() {
            let xflag = false;
            let clientId = this.userInfo ? this.userInfo.clientId : null;
            let token = this.userInfo ? this.userInfo.token : null;
            let password = this.form.password;
            /*if (!/^[a-zA-Z0-9_@.-]{3,40}$/.test(this.form.username)) {
                xflag = true;
                this.errorMsg =
                    this.form.username === "" ?
                    "请输入用户名" :
                    "用户名格式不正确";
                return;
            }*/
            if (this.form.username === "") {
                xflag = true;
                this.errorMsg = "请输入用户名";
                return;
            }
            if (this.form.password === "") {
                xflag = true;
                this.errorMsg = "请输入密码";
                return;
            }
            /*if (!/^[a-zA-Z0-9]{4}$/.test(this.form.verifycode)) {
                xflag = true;
                this.errorMsg =
                    this.form.verifycode === ""
                        ? "请输入验证码"
                        : "验证码格式不正确";
                return;
            }*/
            /*let param = Object.assign({ platform: "DMS" }, this.form, {
                token,
                password: Tools.encryption(password, clientId, token)
            });*/

            let param = Object.assign(this.form, {});
            param.grantType = 'password';
            param.Authorization = 'Basic ' + Base64.encode('dhrp-web:dhrp-web');
            delete param.verifycode;
            if (!xflag) {
                this.errorMsg = "";
                this.userLogin(param).then(
                    res => {
                        this.rememberUser();
                        this.getUserRoleChange(res);
                    },
                    err => {
                        console.log(err);
                        // 记录错误信息
                        this.refreshCode();
                    }
                );
            }
        },
        goUrl(name) {
            this.$router.push({
                name
            });
        },
        gotoClient() {
            window.location.href = process.env.END_URL;
        },
        showAppDownload() {
            this.showCode = true;
        },

        hideAppDownload() {
            this.showCode = false;
        }
    },
    mounted() {
        this.checkBrowserVersion();
        this.getUser();
        this.refreshCode();
    },
    components: {
        UpdateBrowder,
        ForgetPassWord,
        UserMsg
    }
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$top: 80px;
$w: 1200px;
$primary: #03a8ae;

.login-content {
    background: linear-gradient(109deg, #45d0c3, #1591b4);
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-size: cover;

    .login-main {
        width: 1000px;
        height: 500px;
        background: url(./img/login-left.png) no-repeat top left;
        padding-left: 480px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -500px;
        margin-top: -250px;
    }

    .login-form {
        position: relative;
        background-color: #fff;
        height: 500px;
        border-radius: 0 15px 15px 0;

        .appDownload {
            position: absolute;
            bottom: -80px;
            right: -30px;
            background-color: #fff;
            padding: 5px;
            border-radius: 5px;
        }

        .appDownload img {
            height: 130px;
            width: auto;
        }

        .appDownload-text {
            font-size: 12px;
            line-height: 1;
            margin-top: -2px;
            text-align: right;

            span {
                cursor: pointer;
            }
        }

        .copyright {
            color: #999;
            text-align: center;
            font-size: 8px;
            position: relative;
            margin-top: 30px;
        }

        .form-logo {
            position: absolute;
            top: -71px;
            left: 50%;
            margin-left: -71px;
        }

        .form-title {
            color: #0097c0;
            font-weight: 400;

            .system-name {
                padding: 80px 10px 40px;
                text-align: center;

                .version {
                    font-size: 20px;
                    margin-left: 5px;
                }

                .hostpital-name {
                    font-size: 16px;
                    text-align: center;
                    display: block;
                    height: 24px;
                    margin-left: 5px;
                }
            }
        }

        .form-content {
            background: #fff;
            border-radius: 5px;
            padding: 0 50px 10px;

            .showinfo {
                margin-bottom: 10px;

                .tip {
                    display: block;
                    padding-left: 15px;
                    background: #fefcee;
                    border: 1px solid #f3d995;
                    line-height: 26px;
                    color: #df9c1f;
                }

                .errorMsg {
                    background-color: #fef2f2;
                    padding: 6px 10px;
                    border: #f3ab9f 1px solid;
                    border-radius: 3px;
                    clear: both;
                    overflow: hidden;
                    color: #d24821;

                    .el-icon {
                        margin-right: 5px;
                        margin-top: 3px;
                        float: left;
                        width: 16px;
                        height: 16px;
                    }

                    .error {
                        float: left;
                        white-space: normal;
                        word-wrap: break-word;
                        word-break: break-all;
                    }
                }
            }

            .icons {
                width: 15px;
                height: 15px;
                padding-left: 2px;
            }

            .el-form-item {
                margin-bottom: 10px;
            }

            .custom-mgb {
                margin-bottom: 12px;
            }

            .verifyimg {
                float: right;
                display: flex;
                align-items: center;
                padding-left: 10px;

                img {
                    margin-right: 8px;
                }
            }

            .fg-passwd {
                display: flex;
                justify-content: flex-end;
                padding-right: 3px;
            }

            .submit {
                button {
                    width: 100%;
                }
            }
        }
    }
}

.bottom {
    width: 1000px;
    position: absolute;
    bottom: 50px;
    text-align: center;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    line-height: 22px;

    a {
        color: #fff;
    }
}

@media screen and (max-height: 800px) {
    .bottom {
        bottom: 0px;
        transform: translate(-50%, -5%);
    }
}

.login-footer {
    text-align: center;
    padding: 20px;
    font-size: 14px;
}

</style>
