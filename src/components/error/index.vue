<template>
    <section class="container_setion">
        <div class="my-errors">
            <div class="error-icon"></div>
            <p>您所访问的页面不存在</p>
        </div>
    </section>
</template>
<script>
export default {
    name: 'pageError',
    data () {
        return {
            search: {},
            list: []
        };
    },
    computed: {},
    methods: {
    }
};

</script>

<style lang="scss" scoped>
    .my-errors{
        width: 100%;
        text-align: center;
        padding: 100px;
        .error-icon{
            background: url('./img/404.png') no-repeat center center;
            min-height: 100px;
        }
        p {
            font-size: 18px;
            color: #666;
        }

    }
</style>