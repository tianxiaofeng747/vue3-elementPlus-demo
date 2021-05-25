/*
 * @Author: jinqing
 * @Date: 2021-05-11 16:39:57
 * @LastEditors: jinqing
 * @LastEditTime: 2021-05-25 13:44:49
 * @Description: file content
 */
// 格式化图片
import pdf from './img/pdf.png'; // daf
import compressPackage from './img/package.png';
import noimg from './img/noimage.png';
import doc from './img/doc.png';
import txt from './img/txt.png';
import excel from './img/excel.png';

/**
 * 密码加密处理
 */
import CryptoJS from '../aes/aes-min.min.js';
import SHA256 from '../sha256/sha256.min.js';
// 环境配置
// import { Environment } from './index';
import Download from './download.js';

/**
 * 金额格式化
 * @param {*str} n
 */
export const parseMoney = (n) => {
    let _str = '';
    if (isNaN(n)) {
        return;
    }
    let re = /^[0-9]*[1-9][0-9]*$/; // 判断是不是整数
    if (re.test(n) || n == 0) { //eslint-disable-line
        if (n == 0) { //eslint-disable-line
            _str = n + '.00';
        } else {
            _str = parseNum(n) + '.00';
        }
    } else {
        let k = '.' + n.toString().split('.')[1]; // 截取小数
        if (k.length <= 2) {
            k += '0';
        }
        k = k.substr(0, 3);
        let h = JSON.parse(n.toString().split('.')[0]);
        _str = parseNum(h) + k;
    }
    return _str;
};

/**
 * 金额格式化,可正负
 * @param {*} value 
 */
export const parseMoneyPM = (value, show = '--') => {
    value = Number(value);
    if (value === 0) {
        return '0.00';
    }
    if (!value || Number.isNaN(value)) {
        return show;
    }
    let title = value < 0 ? '-' : '';
    return title + parseMoney(Math.abs(value));
};

// 获取类型
export const getType = (obj) => Object.prototype.toString.call(obj).slice(8, -1);

/**
 * 每3位加个','
 * @param {*} num
 */
export const parseNum = (num) => {
    let list = new String(num).split('').reverse(); // eslint-disable-line no-new-wrappers
    for (var i = 0; i < list.length; i++) {
        if (i % 4 === 3) {
            list.splice(i, 0, ',');
        }
    }
    return list.reverse().join('');
};
/**
 * 获取当前时间，格式 yyyy-mm-dd
 */
export const getNowFormatDate = () => {
    let date = new Date();
    let seperator1 = '-';
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

/**
 * 时间格式化
 * @param {*Date} time  new Date()
 * @param {*} fmt  //yyyy-MM-dd
 */
export const format = (time, fmt) => {
    let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        'S': time.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
};

/**
 * 获取上一个月
 * @param {* new Date()} date 
 */
export const getPreMonth = (msg) => {
    let date = format(msg, 'yyyy-MM');
    let arr = date.split('-'),
        year = arr[0], // 获取当前日期的年份
        month = arr[1], // 获取当前日期的月份
        day = arr[2]; // 获取当前日期的日
    let year2 = year,
        month2 = parseInt(month) - 1;
    if (month2 === 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    let day2 = day,
        days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    let t2 = year2 + '-' + month2;
    return t2;
};

/**
 *
 * @param {*文件上传支持的类型} item
 * @param {*定制化上传类型} type
 */
export const getFileType = (item, type = 'all') => {
    if (!item) {
        return null;
    }
    let supportType = { // 支持上传的文件类型
            doc: ['doc', 'docx'],
            xls: ['xls', 'xlsx'], 
            ppt: ['ppt', 'pptx'],
            rar: ['rar', 'zip'],
            txt: ['txt'], 
            pdf: ['pdf'], 
            img: ['image', 'pdf'],
            file: ['doc', 'rar', 'xls', 'txt', 'ppt'],
            bids: ['pdf', 'doc', 'rar'] // 为招标准备的格式
        },
        // 所支持的文件类型
        fileTypes = [
            ['image', 'jpg', 'jpeg', 'png', 'pic', 'bmp', 'gif'],
            ['pdf'],
            ['doc', 'docx'],
            ['rar', 'zip'],
            ['xls', 'xlsx'],
            ['ppt', 'pptx'],
            ['txt']
        ],
        getFile = null;
    if (item.indexOf('.') > -1) {
        let etx = (item.split('.').pop() || '').toLowerCase();
        if (type !== 'all') { // 过滤上传的文件类型
            fileTypes = fileTypes.filter(item => supportType[type].includes(item[0]));
        }
        for (const file of fileTypes) {
            if (file.includes(etx)) {
                getFile = file[0];
                break;
            }
        }
    }
    return getFile;
};

export const formatFile = (item, size) => {
    let thumbnail = '';
    let fileType = getFileType(item);
    switch (fileType) {
        case 'image':
            // Environment.IMAGE_DOWNLOAD + 
            thumbnail = changeImgSize(item, size);
            break;
        case 'pdf':
            thumbnail = pdf;
            break;
        case 'rar':
            thumbnail = compressPackage;
            break;
        case 'xls':
            thumbnail = excel;
            break;
        case 'txt':
            thumbnail = txt;
            break;
        case 'doc':
            thumbnail = doc;
            break;
        default:
            thumbnail = noimg;
            break;
    }
    return thumbnail;
};

/**
 *
 * @param {*改变图片大小} src
 * @param {*} size
 */
export const changeImgSize = (src, size = '100x100') => {
    let i = src.lastIndexOf('.');
    return (src = src.substring(0, i) + '_' + size + src.substring(i));
};

export const encryption = (password, clientid, token) => {
    let _encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(SHA256(password)), CryptoJS.enc.Utf8.parse(clientid), {
        iv: CryptoJS.enc.Utf8.parse(token),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Iso10126
    });
    return CryptoJS.enc.Base64.stringify(_encrypted.ciphertext);
};

/**
 * 监听事件
 * @param {*对象名} obj
 * @param {*绑定类型} evtype
 * @param {*函数} fn
 * @param {*} useCapture
 */
export const addEvent = (obj, evtype, fn, useCapture) => {
    if (obj.addEventListener) {
        obj.addEventListener(evtype, fn, useCapture);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + evtype, fn); // IE不支持事件捕获 
    } else {
        obj['on' + evtype] = fn; // 事实上这种情况不会存在 
    }
};
/**
 * 解绑监听事件
 * @param {*对象名} obj
 * @param {*解绑类型} evtype
 * @param {*函数} fn
 * @param {*} useCapture
 */
export const delEvent = (obj, evtype, fn, useCapture) => {
    if (obj.removeEventListener) {
        obj.removeEventListener(evtype, fn, useCapture);
    } else if (obj.detachEvent) {
        obj.detachEvent('on' + evtype, fn);
    } else {
        obj['on' + evtype] = null;
    }
};

/**
 * 文件下载
 * @param {*下载链接} data
 * @param {*下载文件名} strFileName
 */

export const downloadFile = (data, strFileName) => {
    // 判断是否支持download
    let isSupportDownload = 'download' in document.createElement('a');
    let fileName = strFileName || data.split('/').reverse()[0];
    let fileType = getFileType(data);
    if (fileType === 'image' || fileType === 'pdf') {
        var x = new XMLHttpRequest();
        x.open('GET', data, true);
        x.responseType = 'blob';
        x.onload = function (e) {
            Download(x.response, fileName);
        };
        x.send();
    } else {
        if (isSupportDownload) {
            let aLink = document.createElement('a');
            let evt = document.createEvent('MouseEvents');
            evt.initEvent('click', false, false); // initEvent 不加后两个参数在FF下会报错
            aLink.href = data + '?action=download';
            aLink.download = fileName;
            aLink.dispatchEvent(evt);
        } else {
            var iframe = document.createElement('iframe');
            iframe.src = data + '?action=download';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            setTimeout(() => {
                $('iframe').remove();
            }, 1000);
            // window.open(data + '?action=download', '_blank');
        }
    }
};

// 去掉多余空的children
export const reverseData = (list, map) => {
    list.forEach(item => {
        if (map) {
            item.id = item[map.id];
            item.label = item[map.label];
        } else {
            item.id = item.id || item.no;
            item.label = item.label || item.name;
        }
        if (item.children && item.children.length) {
            reverseData(item.children, map);
        } else {
            delete item.children;
        }
    });
    return list;
};

/**
 * 匹配下拉名称
 * @param {} id 
 * @param {*} source 
 */
export const getSelectValue = (id, source = []) => {
    let result = '';
    source.forEach(item => {
        let value = item.id || item.value || item.val;
        if (id === value) {
            result = item.text || item.label || item.name;
        }
    });
    return result;
};

// 正则
export const regexp = {
    phone: /^1\d{10}$/, // 手机电话
    email: /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{5,50}$/, // 电子邮箱
    ip: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
    idcard: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, // 身份证
    digit: /^[0-9]*$/, // 数字
    bankcard: /^\d{6,50}$/,
    tel: /^((1\d{10})|(0\d{2,3}-\d{7,8})|(0\d{2,3}\d{7,8}))$/,
    chinese: /^[\u4e00-\u9fa5]*$/, // 匹配中文
    internationalTel: /\d{3}-\d{8}|\d{4}-\d{7}/, // 国际电话
    password1: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, // 最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    password2: /^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$/, // 中等强度密码（密码为7位及以上，大小字母、数字三项中有两项，特殊字符可有可无）
    num: /^\d{1,}$/, //  纯数字正则
    en: /^\d{1,}$/, //  纯英文字母正则
    decimals: /^\d+\.\d+$/, //  是否小数
    integer: /^\d+$/ //  正整数
};
export const reverseComponentName = (str= '') => {
    if(!str) {
        return str;
    } else {
        return str.replace(/(\/|\.)/g, '');
    }
};
export default {
    regexp,
    getSelectValue,
    reverseComponentName,
    downloadFile,
    encryption
};