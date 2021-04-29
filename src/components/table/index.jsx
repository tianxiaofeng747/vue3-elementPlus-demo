import { defineComponent, getCurrentInstance, ref, nextTick  } from 'vue';
import {useStore} from 'vuex';
import SHA256 from '@/utils/sha256/sha256.min.js';
import indexDB from './indexDB';
import sectting from './sectting.vue';
import CONFIG from './config';
export default defineComponent({
    props: {
        data: {
            // 显示数据
            type: Array,
            required: true
        },
        enableConfig: {
            type: Boolean,
            default: true
        },
        name: {
            type: String,
            default: ''
        },
        setName: {
            // 设置名称
            type: String
        },
        summaryMethod: {
            type: Function
        },
        // 依赖数据
        depend: {
            type: [Array, Boolean, String, Object, Number]
        },
        // 是否可以修改列名称
        isEditName: {
            type: Boolean,
            default: true
        },
        // 表格行浮动按钮，不需要可以不传
        btns: {
            type: Array,
            default () {
                return [];
            }
        }
    },
    components: {
        sectting
    },
    setup (prop,{ attrs, slots, emit }) {
        const store = useStore();
        const { proxy } = getCurrentInstance();
        let sourceSlots,
            sourceConfig,
            isTableSet = ref(false),
            isFristLoad = true,
            showTable = ref(true),
            sSolts,
            pageKey,
            hash,
            storeConfig,
            config,
            db;
        
        const generateHash = () =>{
            let path = window.location.pathname.split('/').slice(1);
            if (prop.name) {
                path.push(prop.name);
            }
            path = path.join('.');
            // TODO 取值需要修改
            let userInfo = store.getters.userInfo;
            hash = SHA256(
                JSON.stringify(sourceConfig.filter(item => !item.unSet))
            );
            pageKey = `${path}_${userInfo.userNo}`;
            db = new indexDB(pageKey);
        };
        const getPageConfig = () => {
            if (
                !CONFIG.tableUrl ||
                !CONFIG.tableUrl.get ||
                !CONFIG.tableUrl.save
            ) {
                this.$message.error(
                    '请设置表格url地址:tableUrl.save && tableUrl.get'
                );
                return Promise.reject();
            }
            return proxy.Http(CONFIG.tableUrl.get, {
                ignoreRepeat: true,
                params: {
                    configKey: pageKey
                }
            }).then(res => {
                let data = res.data;
                if (data) {
                    data = JSON.parse(data.configValue) || {};
                    storeConfig = data;
                    config = data.config;
                }
            });
        };
        // 初始化配置参数
        const formatProps = () => new Promise(resolve => {
            let arr = [];
            for (const item of sourceSlots) {
                let attr= {
                    ...item.props
                };
                if(CONFIG.unSetCols.includes(attr.label)) {
                    attr.unSet = true;
                }
                arr.push(attr);
            }
            config = arr;
            sourceConfig = JSON.parse(JSON.stringify(arr));
            generateHash();
            // 是否拿过配置信息
            if (isFristLoad) {
                isFristLoad = false;
                // 判断类型
                if (CONFIG.tableMode === 'http') {
                    getPageConfig().then(_ => {
                        resolve();
                    });
                } else {
                    db.initIndexDB().then(data => {
                        storeConfig = data;
                        config = data.config;
                        resolve();
                    });
                }
            } else {
                config = storeConfig.config;
                resolve();
            }
        });
        // 渲染配置图标
        const renderConfigIcon = () => {
            let arr = [];
            if (prop.setName) {
                arr = sourceSlots.filter(
                    item =>
                        item.props.prop ===
                        prop.setName
                );
            } else {
                arr = sourceSlots.filter(item => {
                    let prop =
                                item.props.prop ||
                                item.props.type;
                    return prop === 'index' || prop === 'indexX';
                });
            }
            if (arr && arr.length) {
                if (!arr[0].props['render-header']) {
                    arr[0].dynamicProps = ['render-header'];
                    arr[0].props['render-header'] = () =>(
                        <i class="el-icon-s-tools pointer" onClick={() => {
                            isTableSet.value = true;
                        }}/>
                    );
                }
            }
        };
        // 生成渲染列
        const  createColumnView =  async () => {
            let arr = [];
            config.forEach((item, index) => {
                item.tempSort = index + 1;
            });
            sourceSlots.forEach(item => {
                let propsData = item.props;
                let temp = config.find(subItem => {
                    // label 是显示名， 可能被修改过，所以又定义了个name，默认等于label
                    if (subItem.prop) {
                        let colId = subItem.prop + (subItem.name || subItem.label);
                        return colId === propsData.prop + propsData.label;
                    }
                    if (subItem.type) {
                        return subItem.type === propsData.type;
                    }
                }
                );
                // 给所有列增加这个属性，溢出显示tooltip
                if (propsData['show-overflow-tooltip'] === undefined) {
                    propsData['show-overflow-tooltip'] = true;
                }

                if (temp && !temp.isHide) {
                    Object.assign(propsData, temp);
                    item.tempSort = temp.tempSort;
                    arr.push(item);
                }
                if (!temp) {
                    arr.push(item);
                }
            });
            
            arr.sort((a, b) => a.tempSort - b.tempSort);
            sSolts = arr;
            // hack
            showTable.value = false;
            await nextTick();
            showTable.value = true;
        };
        
        // 列修改
        const changeTableColumns = (a) => {
            config = a;
            createColumnView();
            setConfig();
        };
        const updateConfigShow = (e) =>{
            isTableSet.value = e;
        };
        // 保存配置
        const setConfig = () => {
            let obj = {
                id: pageKey,
                hash,
                config
            };
            if (CONFIG.tableMode === 'http') {
                proxy.Http(CONFIG.tableUrl.save, {
                    ignoreRepeat: true,
                    params: {
                        moduleCode: 'brp',
                        groupCode: 'brp',
                        configKey: pageKey,
                        configValue: JSON.stringify(obj)
                    }
                });
                
            } else if (db.isGetData) {
                db.updateDataDB(obj);
            } else {
                db.addDataDB(obj);
            }
        };
        // 拖动列
        const headerDragend = (newWidth, oldWidth, column) => {
            config.forEach(item => {
                let label = item.label || item.name;
                if (item.prop + label === column.property + column.label) {
                    item.width = newWidth;
                }
            });
            console.log(config);
            setConfig();
            // this.refresh();
        };
        const init = () => {
            sourceSlots = (slots.default() || []);
            console.log(sourceSlots);
            formatProps().then(_ => {
                if (prop.enableConfig) {
                    renderConfigIcon();
                }
                createColumnView();
            });
        };
        init();
        const listeners = {
            on: {
                'header-dragend': headerDragend
            }
        };
        
        // {this.isShowOpt ? (
        //     <div class="yl-table-opt" style={this.optStyle} on-mouseover={this.handleMouseEnterOpt}>
        //         {this.renderOpt()}
        //     </div>
        // ) : null}
        return () => (
            <div>
                {
                    showTable.value ?
                        (<section class="yl-table">
                            <el-table
                                data={prop.data}
                                border
                                size="small"
                                ref="my-table"
                                {...{ attrs: attrs }}
                                {...listeners}
                            >
                                {sSolts}
                            </el-table>
                        </section>) : null
                }
                
                {isTableSet.value ? (
                    <sectting
                        isShow={true}
                        isEditName={prop.isEditName}
                        columns={config}
                        sourceColumns={sourceConfig}
                        onUpdateShow={updateConfigShow}
                        onChange={changeTableColumns}
                    />
                ) : null}
            </div>
        );
    }
});