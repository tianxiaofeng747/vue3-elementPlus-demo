<!--
 * @Author: yangjj
 * @Date: 2020-02-04 18:39:30
 * @LastEditors: jinqing
 * @LastEditTime: 2021-03-16 13:53:57
 * @Description: file content
 -->

:::demo yl-table 是element table的二开,通过配置参数进行渲染

```html
<my-table :data="list" class="my-table">
    <el-table-column type="selection" width="50" align="center" :unSet="true" fixed></el-table-column>
    <el-table-column prop="indexX" label="序号" width="50" align="center" :unSet="true" fixed></el-table-column>
    <el-table-column prop="" label="下单日期" width="90">
        <template slot-scope="scope">
            <p>{{scope.row.orderTime || '-'}}</p>
        </template>
    </el-table-column>
    <el-table-column prop="createName" label="联系人/联系方式" min-width="120">
        <template slot-scope="scope">
            <span>{{scope.row.receiveUser}}</span>/<span class="">{{scope.row.receivePhone}}</span>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="150"  fixed="right" :unSet="true" type="operate">
        <template slot-scope="scope">
            <el-button size="mini" type="text">查看</el-button>
        </template>
    </el-table-column>
</my-table>
<script>
  export default {
      data() {
      return {
          list:[{"deliveryPhone":"","reason":"","terminalClientNo":"63","transportName":"冷链运输","sremark":"42342345432","deliveryTime":"2020-01-20 13:21:21","terminalClientName":"浙江迪安医疗器械有限公司","outStorageType":1,"orderTime":"2020-01-20 13:19:35","modifyTime":"2020-01-20 13:29:30","receiptTime":"2020-01-20","businessUserNo":"000000048","id":"291","operateName":"李路","supplierName":"亚辉龙集团","receivePhone":"16899001234","orderNo":"120000000582","receiveAddr":"浙江省杭州市西湖区三墩镇石祥西路紫荆创业园1401","organizationName":"商务部","transportCode":"LLYS","businessUserName":"黄希夷","deliveryNo":"20200120001001","supplierNo":"2000000","organizationNo":"0006","auditNo":"501610101020","customerName":"杭州云医购供应链科技有限公司","receiveUser":"李路1","cremark":"","lockFlag":"1","returnLabel":0,"deliveryNum":35.00,"createTime":"2020-01-20 13:21:21","auditTime":"2020-01-20 13:21:31","outStatus":"all","auditName":"超级管理员","dataSource":"DMS-CS","deliveryName":"","customerNo":"6019604591","deliveryStatus":"trade_confirm","operateNo":"51000031"},{"deliveryPhone":"","reason":"","terminalClientNo":"","transportName":"航空运输","sremark":"","deliveryTime":"2020-01-16 09:51:17","terminalClientName":"","outStorageType":1,"orderTime":"2020-01-14 19:36:28","modifyTime":"2020-01-18 00:10:19","businessUserNo":"","id":"273","operateName":"超级管理员","supplierName":"亚辉龙集团","receivePhone":"13333949843","orderNo":"120000000559","receiveAddr":"浙江省杭州市西湖区基因小镇14","organizationName":"","transportCode":"HKYS","businessUserName":"","deliveryNo":"20200116200005","supplierNo":"2000000","organizationNo":"","auditNo":"501610101020","customerName":"广州市迪汇医疗器械有限公司","receiveUser":"云医购","cremark":"","lockFlag":"0","returnLabel":0,"deliveryNum":3.00,"createTime":"2020-01-16 09:51:17","auditTime":"2020-01-16 09:51:48","outStatus":"wait","auditName":"超级管理员","dataSource":"DMS-CS","deliveryName":"","customerNo":"6017602777","deliveryStatus":"trade_cancel","operateNo":"501610101020"},{"deliveryPhone":"","reason":"","terminalClientNo":"","transportName":"航空运输","sremark":"","deliveryTime":"2020-01-15 17:07:30","terminalClientName":"","outStorageType":1,"orderTime":"2020-01-14 19:36:28","modifyTime":"2020-01-18 00:10:19","businessUserNo":"","id":"271","operateName":"超级管理员","supplierName":"亚辉龙集团","receivePhone":"13333949843","orderNo":"120000000559","receiveAddr":"浙江省杭州市西湖区基因小镇14","organizationName":"","transportCode":"HKYS","businessUserName":"","deliveryNo":"20200115200032","supplierNo":"2000000","organizationNo":"","auditNo":"501610101020","customerName":"广州市迪汇医疗器械有限公司","receiveUser":"云医购","cremark":"","lockFlag":"0","returnLabel":0,"deliveryNum":1.00,"createTime":"2020-01-15 17:07:30","auditTime":"2020-01-16 10:05:14","outStatus":"wait","auditName":"超级管理员","dataSource":"DMS-CS","deliveryName":"","customerNo":"6017602777","deliveryStatus":"trade_cancel","operateNo":"501610101020"}]
      }
      }
  }
</script>

```

:::

### 实现
* 切换列表顺序
* 切改名称
* 隐藏列表
* 高度自动计算
* 设置图标可配置化
* 继承element写法,所有属性和方法
* 保存有两种方式，远程http 和本地indexDB。

### 注意
* cloumn添加属性
    * unSet是否参与设置,一般`index,sections,操作`需要加上
    * fixed 属性index,sections需要加上,避免设置锁列时出问题,
    * 操作列需要加一个`type="operate"`
* table添加属性
    * showConfig 是否显示设置按钮,这个属性为true,`必须要有index列`
    * name table名称区别唯一
    * setName 指定哪行是设置项,一般不用传
    * height计算内部集成

### Table Attributes
| 参数       | 说明                     | 类型    | 可选值 | 默认值 |
| ---------- | ------------------------ | ------- | ------ | ------ |
| data       | 显示数据,必填            | Array   | --     | --     |
| showConfig | 是否配置                 | Boolean | --     | true   |
| btns       | 需要右侧加hover的按钮组   | Array | --     | []   |
| setName    | 指定哪行是设置项(可不填) | String  | --     | --     |
| depend    | 依赖数据，表格中有v-if依赖该数据时用| Object  | --     | --     |

### Cloumn Attributes
| 参数  | 说明                                            | 类型    | 可选值 | 默认值 |
| ----- | ----------------------------------------------- | ------- | ------ | ------ |
| unSet | 过滤设置时使用,一般index,sections,操作需要加上  | Boolean | --     | --     |
| fixed | 属性index,sections需要加上,避免设置锁列时出问题 | Boolean | --     | --     |
| name | 表格名称，当一个url地址下有多个表格的时候，需要加上 | String | --     | --     |


### 方法
| 参数      | 说明          | 类型      | 可选值  | 默认值  |
| refresh  | 组件方法,重新初始化使用 |  --   |  -- | -- |
| getExportConfig  | 组件方法, 导出table用 |  --  |  -- | -- |



### yl-table 右侧 鼠标悬浮快捷操作按钮 使用方法

- 给table 加上 btns 入参  <yl-table :data="list" :btns="btns" >

- 给具体按钮加上 isTableBtn: true 属性,  注意: **点击事件，只有table button 有 item 回参** 。

  ``` 
   		{
             label: '审批',
  ​          icon: 'icon-shenhe',
  ​          auth: 'btn_saleOrder_audit',
  ​          isTableBtn: true,
  ​          click: (evt, item) => {
  ​            this.showView(item, 'audit');
  ​          }
  ​        }
  ```

- 适当修改具体点击函数， 因为 item  可能没有值。showView (row = this.currentData, type = 'detail') {}
