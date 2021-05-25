<template>
    <yl-dialog title="找回密码" :show.sync="shows" width="800px" :hide="true" :hideSubmitButton="true">
        <div>
            <el-steps :active="activeName" align-center class="forget-passWord-step">
                <el-step title="输入帐号信息"></el-step>
                <el-step title="选择验证方式"></el-step>
                <el-step title="验证身份"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <div class="step-cont">
                <div v-if="activeName == 1">
                    <p class="mgb20"><strong>请输入你需要找回登录密码的帐号：</strong></p>
                    <el-row>
                        <el-col :span="18">
                            <el-form :model="form" ref="formAccount" label-width="100px" :rules="rules">
                                <el-form-item label="登录账号" prop="loginAccount">
                                    <el-input placeholder="请输入用户名/手机号/邮箱" v-model.trim="form.loginAccount" :minlength="6" :maxlength="20"></el-input>
                                </el-form-item>
                                <el-form-item label="验证码" class="custom-mgb" prop="verifycode">
                                    <el-row>
                                        <el-col :span="10">
                                            <el-input placeholder="请输入验证码" v-model.trim="form.verifycode" :maxlength="4" :minlength="4"></el-input>
                                        </el-col>
                                        <el-col :span="2"></el-col>
                                        <el-col :span="10" class="verifyimg">
                                            <img id="imageCode" class="textbox verifyimg" :src="verifyImg" width="80" height="40" alt="验证码" title="点击刷新" />
                                            <el-button @click="refreshCode" type="text">换一张？</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="validUserName">下一步</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                </div>
                <div v-if="activeName == 2">
                    <p class="mgb20"><strong>为确认是你本人操作，请选择验证方式完成身份验证：</strong></p>
                    <div class="choose-block">
                        <el-button type="warning" @click="chooseTelephone" class="right mgt5" :disabled="!msg.secureMobile"><span v-if="msg.secureMobile">立即验证</span><span v-else>未绑定</span></el-button>
                        <h2>通过 手机验证码</h2>
                        <p class="mgt10">如果你的手机还在正常使用，请选择此方式</p>
                    </div>
                    <div class="choose-block">
                        <el-button type="warning" @click="chooseEmail" class="right mgt5" :disabled="!msg.secureEmail"><span v-if="msg.secureEmail">立即验证</span><span v-else>未绑定</span></el-button>
                        <h2>通过 邮箱验证码</h2>
                        <p class="mgt10">如果你的邮箱还在正常使用，请选择此方式</p>
                    </div>
                    <div class="choose-block" v-if="msg.isMaster != '1'">
                        <h2>请联系企业管理员重置密码</h2>
                    </div>
                    <div class="choose-block" v-if="msg.isMaster == '1'">
                        <h2>通过 平台客服</h2>
                        <p class="mgt10">平台客服电话：<strong class="tel">0571-56139089</strong></p>
                    </div>
                </div>
                <div v-show="activeName == 3">
                    <p class="mgb20"><strong>完成身份验证：</strong></p>
                    <el-form :model="msg" ref="msg" label-width="140px" :rules="rules">
                        <el-form-item label="登录账号">
                            <span v-text="msg.loginAccount"></span>
                        </el-form-item>
                        <el-form-item :label="chooseType == 'phone' ? '已绑定手机' : '已绑定邮箱'">
                            <span v-text="msg.secureMobileShow" v-if="chooseType == 'phone'"></span>
                            <span v-text="msg.secureEmailShow" v-if="chooseType == 'email'" :class="msg.secureEmail ? '' : 'text-danger'"></span>
                        </el-form-item>
                        <el-form-item :label="chooseType == 'phone' ? '手机验证码' : '邮箱验证码'" class="custom-mgb" prop="verifycodemobile">
                            <el-row :gutter="5">
                                <el-col :span="10">
                                    <el-input placeholder="请输入验证码" v-model.trim="msg.verifycodemobile" :maxlength="6" :minlength="6"></el-input>
                                </el-col>
                                <el-col :span="10" class="verifyimg">
                                    <el-button @click="getRefreshCode(chooseType)" type="primary" :disabled="surplusTime > 0" v-text="verifyMsg"></el-button>
                                </el-col>
                                <!-- <el-col :span="24" v-if="isVerify">
                                    <span class="text-success" style="color: #f00">验证码不能为空</span>
                                </el-col> -->
                                <el-col :span="24" v-if="sendSuccess">
                                    <span class="text-success" v-if="chooseType == 'phone'">验证码已发送到手机，请注意查看</span>
                                    <span class="text-success" v-if="chooseType == 'email'">验证码已发送到邮箱，请注意查看</span>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="validVerifyCode(chooseType)">下一步</el-button>
                            <el-button type="text" @click="changeChoose">更换一种验证方式</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-show="activeName == 4">
                    <p class="mgb20"><strong>请重新设置你的密码：</strong></p>
                    <el-row>
                        <el-col :span="16">
                            <el-form :model="msg" ref="form" label-width="100px" :rules="rules">
                                <el-form-item label="登录账号">
                                    <span v-text="msg.loginAccount"></span>
                                </el-form-item>
                                <el-form-item label="新密码" prop="password">
                                    <el-input placeholder="请输入密码" v-model.trim="msg.password" type="password"></el-input>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="confirmPassword">
                                    <el-input placeholder="请输入密码" v-model.trim="msg.confirmPassword" type="password"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="eidtPassword">确定</el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <!-- <div class="text-center text-danger" style="font-size: 15px">
                        <p>新密码已发送至：{{ msg.secureMobile }} </p>
                        <p>请登陆系统后修改密码</p>
                    </div> -->
                </div>
            </div>
        </div>
    </yl-dialog>
</template>
<script>
import Tools from '@/utils/customer/global.js';
import emitter from '@/utils/mixins/emitter';
import { mapGetters, mapActions } from 'vuex';
const URL = {
    verifycode: '/verifyCode',
    checkname: 'ddc.uim.userAccount.check',
    updatepassword: 'ddc.uim.userAccount.checkresetpassword', // 修改密码
    getAccountInfoByCheck: 'ddc.uim.userAccount.get',
    sendCode: 'ddc.uim.verification.sendmobilecode',
    checkSendVerifyCode: 'ddc.uim.userAccount.checkresetpassword', // 检验手机验证码及重置密码
    checkmobilecode: 'ddc.uim.verification.checkmobilecode',
    sendEmailCode: 'ddc.uim.userAccount.sendVerifyCodeToEamil',
    checkVerifyCodeToEamil: 'ddc.uim.userAccount.checkVerifyCodeToEamil',
    findPassword: 'ddc.uim.userAccount.updatePasswordForFindPassword',
    getForVerifyCode: 'ddc.uim.userAccount.getForVerifyCode'
};
export default {
    mixins: [emitter],
    data () {
        // 密码校验
        let validatePass = (rule, value, callback) => {
            console.log(value);
            if (value === '' || value === undefined || value === null) {
                callback(new Error('密码不能为空'));
            } else {
                if (value.length < 6 || value.length > 20) {
                    callback(new Error('长度在 6 到 20 个字符'));
                } else {
                    callback();
                }
            }
        };

        // 确认密码
        let validatePass2 = (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
                callback(new Error('密码不能为空'));
            } else if (value.trim() === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.msg.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return {
            activeName: 1,
            verifyImg: '',
            sendSuccess: false,
            isVerify: false,
            chooseType: 'phone',
            form: {
                loginAccount: '',
                verifycode: ''
            },
            verifyMsg: '获取验证码',
            surplusTime: 0,
            msg: {
                mobilePhone: '',
                loginAccount: '',
                verifycode: '' // 验证码
            },
            rules: {
                loginAccount: [
                    // { required: true, min: 6, max: 20, validator: validateLoginAccount, trigger: 'blur', message: '登录账号不存在' },
                    { required: true, message: '请输入登录账号', trigger: 'blur' },
                    {
                        required: true,
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '登录账号不存在',
                        url: URL.checkname,
                        params () {
                            return {
                                // reverse: true,
                                loginAccount: this.form.loginAccount
                            };
                        }
                    }
                ],
                verifycodemobile: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' },
                    { min: 6, max: 6, message: '长度 6 位数', trigger: 'blur' }
                    /* {
                        validator: this.formValid,
                        trigger: 'blur',
                        message: '验证码错误',
                        url: URL.checkmobilecode,
                        params () {
                            return {
                                reverse: true,
                                mobilePhone: this.msg.secureMobile,
                                code: this.msg.verifycodemobile

                            };
                        }
                    } */
                ],
                verifycode: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' },
                    { min: 4, max: 4, message: '长度 4 位数', trigger: 'blur' }
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        ...mapActions({
            'userLogin': 'login',
            'currentUser': 'currentUser',
            'getroles': 'getroles'
        }),
        _countDown () {
            this.surplusTime--;

            if (this.surplusTime <= 0) {
                this.sendSuccess = false;
                this.verifyMsg = '获取验证码';
            } else {
                this.verifyMsg = `重新获取验证码(${this.surplusTime})`;
                setTimeout(() => {
                    this._countDown();
                }, 1000);
            }
        },

        // 获取手机验证码
        getRefreshCode (type) {
            if (type === 'phone') {
                this.Http(URL.sendCode, {
                    mobilePhone: this.msg.secureMobile
                }).then((res) => {
                    this.sendSuccess = true;
                    this.surplusTime = 60;
                    this._countDown();
                });
            } else {
                this.Http(URL.sendEmailCode, {
                    eamil: this.msg.secureEmail
                }).then((res) => {
                    this.sendSuccess = true;
                    this.surplusTime = 60;
                    this._countDown();
                });
            }
        },

        // 刷新验证码
        getRandomImg () {
            this.form.verifycode = '';
            this.verifyImg = '/gateway' + URL.verifycode + '?t=' + Math.round(Math.random() * 1000000);
        },

        // 获取用户信息
        refreshCode () {
            if (this.userInfo && this.userInfo.token) {
                this.getRandomImg(); // 通过验证码获取token
            } else {
                this.currentUser().then(() => {
                    this.getRandomImg();
                }, () => {
                    this.getRandomImg();
                });
            }
        },
        // 验证用户名
        validUserName () {
            this.$refs.formAccount.validate((valid) => {
                if (valid) {
                    let param = { ...this.form };
                    this.Http(URL.getForVerifyCode, param).then((res) => {
                        let msg = res.data;
                        // msg.secureEmail = '250790516@qq.com'
                        msg.secureMobileShow = msg.secureMobile ? msg.secureMobile.substr(0, 3) + '****' + msg.secureMobile.substr(7) : '没有绑定的手机';
                        msg.secureEmailShow = msg.secureEmail ? msg.secureEmail.substr(0, 3) + '****' + msg.secureEmail.substr(7) : '没有绑定的邮箱';
                        this.$set(this, 'msg', msg);
                        this.activeName = 2;
                    });
                } else {
                    return false;
                }
            });
        },

        // 选择手机号
        chooseTelephone () {
            this.activeName = 3;
            this.chooseType = 'phone';
        },

        // 选择邮箱
        chooseEmail () {
            this.activeName = 3;
            this.chooseType = 'email';
        },

        // 更换验证方式
        changeChoose () {
            this.activeName = 2;
            this.surplusTime = 0;
            this.sendSuccess = false;
            this.verifyMsg = '获取验证码';
            this.msg.verifycodemobile = '';
        },

        // 修改密码
        eidtPassword () {
            console.log(this.msg.password);
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let params = {
                        password: Tools.encryption(this.msg.password, this.userInfo.clientId, this.userInfo.token),
                        // confirmPassword: Tools.encryption(this.msg.confirmPassword, this.userInfo.clientId, this.userInfo.token),
                        // loginAccount: this.msg.loginAccount,
                        userNo: this.msg.userNo,
                        accountType: this.chooseType
                    };
                    this.Http(URL.findPassword, params).then((res) => {
                        this.$message({
                            message: '找回密码成功',
                            type: 'success'
                        });
                        this.shows = false;
                    });
                } else {
                    return false;
                }
            });
        },

        // 验证验证码
        validVerifyCode (type) {
            if (type === 'phone') {
                this.$refs.msg.validate((valid) => {
                    if (valid) {
                        this.isVerify = false;
                        let params = {
                            code: this.msg.verifycodemobile,
                            mobilePhone: this.msg.secureMobile
                        };
                        this.Http(URL.checkmobilecode, params).then((res) => {
                            console.log(res);
                            if (res.data) {
                                this.activeName = 4;
                            } else {
                                this.$message({
                                    message: '验证码错误',
                                    type: 'warning'
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            } else {
                this.$refs.msg.validate((valid) => {
                    if (valid) {
                        this.isVerify = false;
                        let params = {
                            code: this.msg.verifycodemobile,
                            eamil: this.msg.secureEmail
                        };
                        this.Http(URL.checkVerifyCodeToEamil, params).then((res) => {
                            console.log(res);
                            if (res.data) {
                                this.activeName = 4;
                            } else {
                                this.$message({
                                    message: '验证码错误',
                                    type: 'warning'
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        },
        ...mapGetters(['userInfo', 'routers'])
    },
    mounted () {
        this.refreshCode();
    }
};

</script>
<style lang="scss" scoped>
.dictionary-btns {
    cursor: pointer;
}

.step-cont {
    padding: 50px 20px;
}

.verifyimg {
    vertical-align: middle;
}

.forget-passWord-step {
    margin-top: 20px;

    :deep .el-step__icon {
        width: 40px;
        height: 40px;
        transform: rotate(45deg);
        background-color: #c0c4cc;
        color: #fff;
    }

    :deep .el-step__icon.is-text {
        border-radius: 0;
    }

    :deep .el-step__icon-inner {
        transform: rotate(-45deg);
        font-size: 20px;
    }

    :deep .el-step.is-horizontal .el-step__line {
        top: 19px;
    }

    :deep .el-step__title {
        font-size: 14px;
        margin-top: 10px;
    }

    :deep .is-finish .el-step__icon {
        background-color: #03a8ae;
    }

    :deep .is-process .el-step__icon {
        background-color: #303133;
    }

}

.choose-block {
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    padding: 20px;

    .tel {
        color: #ff6600
    }

    .el-button--warning {
        color: #fff;
        background-color: #ff6600;
        border-color: #ff6600;
    }

    .el-button--warning.is-disabled {
        background-color: #f3d19e;
        border-color: #f3d19e;
    }
}

.choose-block+.choose-block {
    margin-top: 20px;
}

</style>
