// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。'
// };

/**
 * code : 接口响应返回的code  Array
 * success : 接口返回是否报错 true/false
 * show:{
 *  msg: '登陆过期', //错误提示消息,没有就使用后端返回
 *  href: '/login', //跳转地址
 *  clear: true  //是否要清除session缓存
 * }
 */
const codeResponse = [{
    code: ['SUCCESS', '0', '00000'],
    success: true
}, {
    code: ['SESSION_EXPIRED', '5000'], // 登陆过期
    success: false,
    show: {
        msg: '登陆过期',
        href: '/login',
        clear: true   
    }
}, {
    code: ['FAILURE'], // excel导入检验失败code
    success: false
}, {
    code: ['5001'], // 禁用
    success: false,
    show: {
        href: '/login',
        clear: true   
    }
}];
  
export default codeResponse;