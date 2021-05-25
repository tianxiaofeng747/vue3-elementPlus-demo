<template>
    <div class="custom-prompt" :class="{active:checked}">
        <div class="search-button" @click="showDetail">
            <span>页面操作提示</span>
            <i class="prompt-icon el-icon-arrow-down"></i>
        </div>
        <div class="dropdown">
            <div>
                <div class="dropdown-icon">
                    <yl-icon icon="icon-dengpao" class="icon-idea"></yl-icon>
                </div>
                <div class="dropdown-content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            pullStyle: {
                color: ''
            }
        };
    },
    props: {
        isShow: Boolean,
        default: () => false
    },
    computed: {
        checked: {
            get () {
                return this.isShow;
            },
            set (val) {
                this.$emit('update:isShow', val);
            }
        }
    },
    methods: {
        showDetail () {
            this.checked = !this.checked;
            if (this.checked) {
                this.pullStyle = {
                    color: '#ff6600'
                };
            } else {
                this.pullStyle = {
                    color: '#2c9cea'
                };
            }
        }
    }
};
</script>
<style lang="scss" rel="stylesheet/scss">
    $buttonHeight: 40px;
    .custom-prompt {
        position: relative;
        clear: both;
        width: 100%;
        .prompt-icon{
            transition: all ease 0.3s;
        }
        .search-button {
            position: absolute;
            top: -$buttonHeight + 1px;
            right: 0;
            z-index: 10;
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 0 10px;
            width: 120px;
            height: $buttonHeight;
            span {
                color: #98a3b2;
                margin-right: 8px;
            }
        }
        .dropdown {
            display: none;
            transition: all ease 0.3s;
            border: 1px #ffdea9 solid;
            border-radius: 5px;
            border-top-right-radius: 0;
            box-sizing: border-box;
            z-index: 99;
            background: #fffbeb;
            padding: 10px;
            & > div {
                display: flex;
                width: 100%;
                flex-wrap: nowrap;
                justify-content: flex-start;
                .dropdown-icon {
                    margin-right: 5px;
                    .icon-idea {
                        width: 42px;
                        height: 42px;
                    }
                }
                .dropdown-content {
                    word-break: break-all;
                    line-height: 20px;
                    padding: 5px;
                }
            }

        }
        &.active {
            .prompt-icon{
                transform: rotate(180deg);
            }
            .search-button {
                border: 1px #ffdea9 solid;
                border-bottom: 1px #fff solid;
                border-top-right-radius: 5px;
                border-top-left-radius: 5px;
                background: #fffbeb;
                span, i{
                    color: #ff8800;
                }
            }
            .dropdown {
                display: block;
            }
        }
    }

</style>
