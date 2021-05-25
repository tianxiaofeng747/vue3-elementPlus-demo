/*
 * @Author: jinqing
 * @Date: 2020-01-15 18:57:39
 * @LastEditors: jinqing
 * @LastEditTime: 2021-03-24 17:07:50
 * @Description: file content
 */
const BASE = {
    // 临时缓存组件路径：想被缓存的组件不能有name 属性， 否则不生效
    cacheUrls: [],
    // more跳转地址
    defaultUrl: '/app/hello',
    // 不需要验证用户信息
    skipAuth: ['/login', '/register', '/perfectRegister', '/invite'],
    // 组件路径名称对照  - key 是 组件路径  value 是路由name
    pageNames: {
        'sale/saleOrder': 'scmSaleOrder',
        'humanResources/user': 'MyUserPage'
    },
    // 头部菜单的icon
    haderIcons: {
        'GPO-S': '协同管理:icon-daohang-dianpu',
        'DSRP-CPY': '协同云:icon-title-xietongyun',
        'DSRP-XSY': '销售云:icon-pms-xiaoshouyun',
        'DSRP-CGY': '采购云:icon-pms-caigouyun',
        'DSRP-JCZL': '基础资料:icon-pms-jichuziliao',
        'DSRP-XTSZ': '系统设置:icon-pms-xitongshezhi'
    }
};

export default BASE;