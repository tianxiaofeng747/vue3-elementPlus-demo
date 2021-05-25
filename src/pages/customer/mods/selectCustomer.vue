<template>
    <el-dialog title="选择客户" v-model="show" width="90%">
        <div class="widget-box" :class="{'widget-box-close':closeWidget}">
            <div class="widget-left" >
                <el-tooltip class="item" effect="dark" :content="closeWidget ? '点击展开' : '点击收缩'" placement="right">
                    <div class="widget-header pointer" @click="closeWidget = !closeWidget">
                        <i class="iconfont" :class="closeWidget ? 'icon-quanping11' : 'icon-quanping1'"></i>
                        <p>价格体系</p>
                    </div>
                </el-tooltip>
                <div class="widget-body">
                    <div class="tree">
                        <el-tree :data="priceCategoryOpt" ref="menuTree" :props="defaultProps" highlight-current node-key="no" :filter-node-method="filterNode" :expand-on-click-node="false" :default-expanded-keys="defaultExpand" default-expand-all @node-expand="expandNode" @node-collapse="collapseNode" @current-change="handleNodeClick">
                        </el-tree>
                    </div>
                </div>
            </div>
            <div class="widget-right">
                <el-form :inline="true" :model="search" size="mini" @submit.native.prevent>
                    <el-form-item class="searchBox">
                        <el-input placeholder="客户编码/客户名称/统一社会信用代码/联系人/联系电话" class="w400" v-model.trim="search.keywords" @keyup.enter.native="getList()"></el-input>
                        
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="mgr10" icon="el-icon-search" @click="getList(1)">查询</el-button>
                        <el-button type="default" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="list" border stripe @selection-change="handleSelectionChange" ref="my-table" highlight-current-row @current-change="setCurrentRow" v-loading="isLoading" @row-dblclick="dblclick" @row-click="rowClick" row-key="customerNo">
                    <el-table-column type="selection" width="40" align="center" :selectable="handleSelectable" v-if="selectType === 'checkbox'" reserve-selection></el-table-column>
                    <el-table-column prop="index" width="40" align="center" v-else>
                        <template #default="scope">
                            <el-radio v-model="currentNo" :label="scope.row.customerNo">
                                <span style="display:none"></span>
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="45" align="center"></el-table-column>
                    <el-table-column prop="customerCode" label="客户编码"></el-table-column>
                    <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerCategoryName" label="基本分类"></el-table-column>
                    <el-table-column prop="unifiedSocialCode" label="统一社会信用代码"></el-table-column>
                    <el-table-column prop="linkMan" label="联系人" width="80"></el-table-column>
                    <el-table-column prop="linkPhone" label="联系电话" align="center" width="100"></el-table-column>
                </el-table>
                <el-row>
                    <el-col :span="4">
                        <div style="line-height:30px; padding-top:3px;" v-if="selectType == 'checkbox'">
                            已选择 <el-tag size="mini">{{checkedNum}}</el-tag> 条
                        </div>
                    </el-col>
                    <!-- <el-col :span="20">
                        <el-pagination ref="pagination" class="right mgt5" :total="page.total" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList"></el-pagination>
                    </el-col> -->
                </el-row>
            </div>
        </div>
         <template #footer>
            <span class="dialog-footer">
            <el-button @click="shows = false">取 消</el-button>
            <el-button type="primary" @click="shows = false">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import {Dictionarie} from '@/utils/customer/tools'
const URL = {
    list: 'dsrp.bdc.customer.findListPageByFormal',
    tree: 'dsrp.bdc.customerCategorymanager.findTree'
};
// 企业类型 cs:厂商，jxs：经销商，yy：医疗机构
const enterpriseTypeOpt = [
    { value: null, label: '企业类型' },
    { value: 'cs', label: '生产企业' },
    { value: 'jxs', label: '经营企业' },
    { value: 'cs,jxs', label: '生产+经营' },
    { value: 'yy', label: '医疗机构' }
];
export default {
    data () {
        return {
            isLoading: false,
            closeWidget: false,
            currentNo: '',
            defaultProps: {
                label: 'dictVal'
            },
            priceCategoryOpt: [],
            enterpriseTypeOpt,
            page:{
                pageIndex: 1,
                pageSize: 20
            },
            normalizer (node) {
                if (node.children && !node.children.length) {
                    delete node.children;
                }
                return {
                    id: node.no,
                    label: node.label,
                    children: node.children
                };
            },
            search: {
                priceCategoryCode: null,
                customerCategoryNo: null,
                enterpriseType: null,
                controlStatus: null,
                keywords: ''
            },
            tree: [],
            multipleSelection: [],
            list: [],
            checkCustomerNos: [],
            currentRow: null,
            checked: {
                number: null
            }, // 选中的row
            defaultExpand: null, // 默认展开
            expandNods: [] // 记录展开的节点
        };
    },
    emits: ['update'],
    methods: {
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        rowClick (row) {
            if (this.selectType === 'checkbox') {
                this.$refs['my-table'].toggleRowSelection(row);
            }
        },
        // 双几行
        dblclick (row) {
            if (this.selectType === 'radio') {
                this.currentRow = row;
                this.submit();
            }
        },
        // 树
        filterNode (value, data) {
            if (!value) return true;
            return data.categoryName.indexOf(value) !== -1;
        },
        expandNode (node) {
            this.expandNods.push(node.no);
        },
        collapseNode (node) {
            this.expandNods = this.expandNods.filter(item => item !== node.no);
        },
        // 选中分类节点
        handleNodeClick (row) {
            this.checked = row;
            this.getList();
        },
        //  获取左侧分类树
        getTree () {
            this.Http(URL.tree, {}).then(res => {
                this.tree = res.data;
                if (res.data.length) {
                    this.defaultExpand = this.expandNods;
                }
            });
        },
        // 获取列表数据
        getList (
            pageIndex = this.page.pageIndex,
            pageSize = this.page.pageSize
        ) {
            let params = {
                ...this.search,
                priceCategoryCode: this.checked.number
            };
            this.currentRow = null;
            this.isLoading = true;
            this.Http(URL.list, {
                pageDto: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                },
                params
            }).then(res => {
                this.isLoading = false;
                this.page.total = res.data.total;
                this.page.pageIndex = res.data.pageIndex;
                this.page.pageSize = res.data.pageSize;
                this.currentNo = '';
                let checkedRows = [];
                this.list = res.data.rows.map((item, index) => {
                    item.index =
                        (this.page.pageIndex - 1) * this.page.pageSize +
                        index +
                        1;
                    if (this.checkCustomerNos.includes(item.customerNo)) {
                        this.checkCustomerNos = this.checkCustomerNos.filter(data => data !== item.customerNo);
                        checkedRows.push(item);
                    }
                    // 针对单选
                    if (item.customerNo === this.selectedNo) {
                        this.setCurrentRow(item);
                    }
                    return item;
                });
                if (checkedRows.length) {
                    // this.$nextTick(() => {
                    //     checkedRows.forEach(row => {
                    //         this.$refs['my-table'].toggleRowSelection(row, true); 
                    //     });
                    // });
                }
            });
        },
        //  选择行
        setCurrentRow (row) {
            if (row) {
                this.currentRow = row;
                this.currentNo = row.customerNo;
            }
        },
        // 重置
        reset () {
            this.search.enterpriseType = null;
            this.checked = {
                number: null
            };
            this.search.keywords = '';
            this.getList();
        },
        // 提交
        submit () {
            if (this.selectType === 'radio') {
                if (!this.currentRow) {
                    this.$message.warning('请选择客户');
                    return false;
                }
                this.$emit('update', this.currentRow);
            } else {
                // 获取没有命中选中，但是初始化进来的客户
                let transferChecks = this.selected.filter(item => this.checkCustomerNos.includes(item.customerNo));
                let multipleSelection = this.multipleSelection.concat(transferChecks);
                if (!multipleSelection.length) {
                    this.$message.warning('请选择客户');
                    return false;
                }
                this.$emit('update', multipleSelection);
            }
            this.shows = false;
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        // 单选 或者多选
        selectType: {
            type: String,
            validator: function (value) {
                return ['checkbox', 'radio'].indexOf(value) !== -1;
            },
            default: 'radio'
        },
        // 已选中的rows 多选用
        selected: {
            type: Array,
            default: () => []
        },
        // 选中的 customerNo 单选用
        selectedNo: {
            type: String
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
        checkedNum () {
            return this.checkCustomerNos.length + this.multipleSelection.length;
        }
    },
    watch: {
        filterText (val) {
            this.$refs.menuTree.filter(val);
        }
    },
    created () {
        this.getTree();
        // 从数据字典获取价格体系
        Dictionarie('dsrp_price_customer_category').then(res => {
            this.priceCategoryOpt = [{ number: null, dictVal: '全部' }].concat(res || []);
            console.log(this.priceCategoryOpt);
        });
        this.getList();
        if (this.selectType === 'checkbox') {
            this.checkCustomerNos = this.selected.map(item => item.customerNo);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>