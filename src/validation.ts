/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-24 15:05:52
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-05-16 16:04:22
 * @项目的路径: \utils\src\validation.ts
 * @描述: 常用验证工具类方法
 */

// 中国手机号码验证
export function chinaPhoneNumberValidate(phoneNumber: string): boolean {
    return !!phoneNumber && /^1[0-9]{10}$/.test(phoneNumber.replace(/\s/g, ""));
}

// 验证邮箱
export function emailValidate(email: string): boolean {
    return !!email && /^([a-zA-Z0-9_\\.\\-])+@(([a-zA-Z0-9\\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.trim());
}

// 中国身份证验证（支持香港、澳门、台湾）
export function chinaIDCardValidate(IDCard: string): boolean {
    if (!IDCard || !IDCard.trim()) {
        return false;
    }
    IDCard = IDCard.trim();
    if (/^[a-zA-Z][0-9]{6}((（|\()[0-9aA](\)|）)|[0-9aA])$/.test(IDCard)) {
        // 香港
        return true;
    } else if (/^[a-zA-Z][0-9]{9}$/.test(IDCard)) {
        // 台湾
        const genderSex: string = IDCard.substring(1, 2);
        if (genderSex === "1" || genderSex === "2") {
            return true;
        }
        return false;
    } else if (/^[157]\d{6}((（|\()[0-9](\)|）))$/.test(IDCard)) {
        // 澳门
        return true;
    } else if (/^[1-9][0-9]{5}(18|19|20)?[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(IDCard)) {
        // 大陆身份证(18位，不支持15位)
        // 18位身份证需要验证最后一位校验位
        const IDCardArray: string[] = IDCard.split("");
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验位
        const parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0,
            ai = 0,
            wi = 0;
        for (let i = 0; i < 17; i++) {
            ai = parseInt(IDCardArray[i], 10);
            wi = factor[i];
            sum += ai * wi;
        }
        const last = String(parity[sum % 11]);
        if (last !== IDCardArray[17].toLocaleUpperCase()) {
            return false;
        }
        return true;
    }
    return false;
}

/**
 * 验证银行卡
 *
 * 验证规则是：全数字，10到30位, 覆盖对公/私账户, 参考[微信支付](https://pay.weixin.qq.com/wiki/doc/api/xiaowei.php?chapter=22_1)
 */
export function validateBankCard(bankCard: string): boolean {
    if (!bankCard) return false;
    return /^[1-9][0-9]{9,29}$/.test(bankCard.trim());
}

/**
 * 验证中国姓名
 *
 * 验证规则是：全汉字，或者汉字之间有（·），或者全英文
 * 用例：1:测试，2:艾格里·买买提，3:jack yu
 * 错误用例：1.测 试，2.测试J，4.J
 */
export function validateName(name: string): boolean {
    if (!name) return false;
    return /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\\·]{0,18}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,18}[a-zA-Z]{1}$)/.test(name.trim());
}

/**
 * 全汉文验证
 * 汉文指是汉语、日本语、朝鲜语、韩国语的书写系统中的一种文字
 */
export function validateChineseCharacter(word: string): boolean {
    if (!word) return false;
    return /^[\p{Unified_Ideograph}]+$/gu.test(word);
}

/**
 * 验证密码格式
 *
 * 验证规则是：密码内容长度8-20位，且必须是数字、小写字母、大写字母、特殊字符这四种组合
 * 用例：1:1W2D8^yu123edc
 * 错误用例：1.1A2*()3U23U，2.1a2*()3u23u
 */
export function validatePassword(password: string): boolean {
    return /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s])^([0-9A-Za-z]|[^\w\s]){8,20}$/.test(password);
}

/**
 * 验证统一社会信用代码
 * 验证规则：
 *  1. 统一代码由十八位的阿拉伯数字或大写英文字母(不使用I、O、Z、S、V)组成
 *  2. 第1位登记管理部门代码
 *  3. 第2位机构类别代码
 *  4. 第3位~第8位登记管理机关行政区划码
 *  5. 第9位~第17位主体标识码(组织机构代码)
 *  6. 第18位校验码
 * 用例：91350100M000100Y43
 */
export function validateSocialCreditCode(code: string): boolean {
    if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(code)) {
        return false;
    }
    // 代码字符集 不含I、O、S、V、Z
    const CHARTS = "0123456789ABCDEFGHJKLMNPQRTUWXY";
    const totalCode = code
        .split("")
        .slice(0, 17)
        .reduce((total, value, index) => {
            // 权重与加权因子相乘之和
            return total + CHARTS.indexOf(value) * (Math.pow(3, index) % 31);
        }, 0);
    return code.slice(-1) === CHARTS[31 - (totalCode % 31)];
}

/**
 * 统一社会信用代码(宽松匹配)(15位/18位/20位数字/字母)
 */
export function validateSimpleSocialCreditCode(code: string): boolean {
    return /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/.test(code);
}
