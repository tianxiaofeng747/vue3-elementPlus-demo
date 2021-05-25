/**
     * 为数字加上单位：万或亿
     *
     * 例如：
     *      1000.01 => 1000.01
     *      10000 => 1万
     *      99000 => 9.9万
     *      566000 => 56.6万
     *      5660000 => 566万
     *      44440000 => 4444万
     *      11111000 => 1111.1万
     *      444400000 => 4.44亿
     *      40000000,00000000,00000000 => 4000万亿亿
     *      4,00000000,00000000,00000000 => 4亿亿亿
     *
    
     */
let addWan = function (integer, number, mutiple, decimalDigit) {
    let digit = getDigit(integer);
    if (digit > 3) {
        let remainder = digit % 8;
        if (remainder >= 5) { // ‘十万’、‘百万’、‘千万’显示为‘万’
            remainder = 4;
        }
        return Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit) + '万';
    } else {
        return Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit);
    }
};

let getDigit = function (integer) {
    let digit = -1;
    while (integer >= 1) {
        digit++;
        integer /= 10;
    }
    return digit;
};
/**
 * @param {number} number 输入数字.
 * @param {number} decimalDigit 小数点后最多位数，默认为2
 * @return {string} 加上单位后的数字
 */
export default (number, decimalDigit = 2) => {
    let integer = Math.floor(number),
        digit = getDigit(integer), // 数字长度-1
        // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
        unit = [];
    if (digit > 3) {
        let multiple = Math.floor(digit / 8);// 查看是否过亿
        if (multiple >= 1) {
            let tmp = Math.round(integer / Math.pow(10, 8 * multiple));
            unit.push(addWan(tmp, number, 8 * multiple, decimalDigit));
            for (let i = 0; i < multiple; i++) {
                unit.push('亿');
            }
            return unit.join('');
        } else {
            return addWan(integer, number, 0, decimalDigit);
        }
    } else {
        return number;
    }
};
