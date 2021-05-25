import { defineComponent, reactive } from 'vue';
export default defineComponent({
    props: {
        initValue: Number
    },
    setup (prop) {
        console.log('prop', prop);
        const state = reactive({
            count: prop.initValue
        });
        const inc = () => state.count++;
        const dec = () => state.count--;
        return () => (
            <div>
                <p>{state.count}</p>
                <el-button onClick={inc}>inc</el-button>
                <el-button onClick={dec}>dec</el-button>
            </div>
        );
    }
});