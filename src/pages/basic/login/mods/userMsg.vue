<template>
    <yl-dialog title="选择机构/科室" :show.sync="shows" width="400px" @submit="submit" :hideCancelButton="true" buttonSize="mini" :append-to-body="true">
        <div class="user-block">
            <el-form ref="form" :model="form" label-width="0" :rules="rules" size="mini">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="" prop="id">
                            <el-select v-model="form.id" placeholder="选择机构/科室" filterable clearable>
                                <el-option v-for="(item, index) in userInfo.currentUserList" :key="item.id" :label="item.tenantDeptName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </yl-dialog>
</template>
<script>
import formValid from '@/utils/mixins/formValid.js';
import { mapGetters, mapMutations } from 'vuex';
const URL = {
    switch: 'gateway-auth/auth/authUserRole/switchTenantDept',
};
export default {
    mixins: [formValid],
    data() {
        return {
            form: {
                id: ''
            },
            rules: {
                id: [{
                    required: true,
                    message: '选择机构/科室',
                    trigger: 'change'
                }],
            }
        };
    },
    methods: {
        ...mapMutations(['SETTEMPNAVS']),
        // 提交
        async submit() {
            if (this.validating) {
                await this.validating;
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    let params = {
                        ...this.form
                    };
                    params.Authorization = 'bearer ' + this.userInfo.access_token;
                    this.Http(URL.switch, params).then(res => {
                        this.$message.success('切换成功');
                        this.shows = false;
                        let userInfo = this.$store.getters.userInfo;
                        userInfo.currentUser = res.data;
                        this.$store.commit('CHANGEUSER', userInfo);
                        this.$router.push(this.defaultUrl);
                        if (this.type === 'header') {
                            let homeMenu = this.tempNavs.filter(item => item.closeable === false);
                            this.SETTEMPNAVS(homeMenu);
                            window.location.reload();
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    },
    mounted() {

    },
    created() {
        console.log(this.type)
    },
    computed: {
        ...mapGetters(['tempNavs', 'userInfo']),
        shows: {
            get() {
                return this.show;
            },
            set(newValue) {
                this.$emit('update:show', newValue);
            }
        }
    },
    props: {
        type: {
            type: String,
            default: 'login'
        },
        defaultUrl: {
            type: String
        },
        userInfo: {
            type: Object,
            default: () => ({})
        },
        show: {
            type: Boolean,
            required: true,
            default: false
        }
    }
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.user-block {
    padding: 1rem;
}

</style>
