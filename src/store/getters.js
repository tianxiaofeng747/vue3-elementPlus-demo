/*
 * @Author: jinqing
 * @Date: 2020-11-05 10:02:48
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-23 14:22:31
 * @Description: file content
 */
export default {
    userInfo: state => state.user.userInfo,
    token: state => state.user.userInfo && state.user.userInfo.token, // 用户token
    enterpriseNo: state =>
        state.user.userInfo && state.user.userInfo.enterpriseNo, // enterpriseNo
    enterpriseName: state =>
        state.user.userInfo && state.user.userInfo.enterpriseName, // enterpriseName
    clientid: state => state.user.userInfo && state.user.userInfo.clientId, // clientid
    enterpriseGroupType: state =>
        state.user.userInfo && state.user.userInfo.enterpriseGroupType, // enterpriseGroupType
    routers: state => state.permission.routers,
    menuList: state => state.user.menuList,
    buttons: state => state.user.buttons,
    collectList: state => state.user.collectList
};
