<template>
    <div>
        <div class="version-browser"></div>
        <div class="version-bg">
             <el-button type="primary" @click="updateBrowser" class="update-browser">立即升级</el-button>
        </div>
       
    </div>
</template>

<script type="text/javascript">
export default {
    data () {
        return {};
    },
    methods: {
        updateBrowser () {
            window.open('https://www.google.cn/chrome/');
        } 
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.version-browser{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    opacity: .8;
    background: #000;
    z-index:1;
}
.version-bg{
    position: absolute;
    top: 50%;
    left:50%;
    height:440px;
    width:460px;
    margin-top:-220px;
    margin-left:-230px;
    z-index:2;
    background:url(../img/version.png) no-repeat;
    .update-browser{
        width:166px;
        height:46px;
        position:absolute;
        bottom: 56px;
        left: 151px;
        opacity: 0;
    }
}
</style>