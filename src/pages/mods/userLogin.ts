/*
 * @Author: jinqing
 * @Date: 2021-04-23 14:47:39
 * @LastEditors: jinqing
 * @LastEditTime: 2021-04-23 15:39:43
 * @Description: file content
 */
import CryptoJS from '@/utils/aes/aes-min.min.js';
import SHA256 from '@/utils/sha256/sha256.min.js';
import store from '@/store/index';
import { ElMessage } from 'element-plus'
const encryption = (password:String, clientid:String, token:String):void => {
    let _encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(SHA256(password)), CryptoJS.enc.Utf8.parse(clientid), {
      iv: CryptoJS.enc.Utf8.parse(token),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Iso10126
    });
    return CryptoJS.enc.Base64.stringify(_encrypted.ciphertext);
};

const doLogin = (token:String, clientId: String) => {
    //let clientId = this.userInfo ? this.userInfo.clientId : null;
    let param = Object.assign({ platform: 'DSRP' }, {
        token,
        username: 'ymjyljs',
        password: encryption('123456', clientId, token)
    });
    return store.dispatch('login', param).then(
        (msg: Object) => {
            console.log(msg);            
        },
        err => {
            console.log(err);
        }
    );
}
const login = () => {
    store.dispatch('currentUser').then(res => {
        let {clientId, token, enterpriseNo} = res;
        if(!enterpriseNo){
            doLogin(token, clientId).then(res => {
                ElMessage('登录成功');
            });
        } else {
            ElMessage('已登录');
        }
        console.log(res);
    }); 
};
export default login;

