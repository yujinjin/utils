/**
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-24 15:05:52
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\validation.ts
 * @描述: 常用验证工具类方法
 */

/**
 * 中国手机号码验证
 *
 * 验证规则：11位数字，首位必须为1
 * 输入中的空格会被自动去除后再验证
 *
 * @param phoneNumber - 待验证的手机号码字符串
 * @returns 验证通过返回 true，否则返回 false
 *
 * @example
 * chinaPhoneNumberValidate("13643564144")  // => true
 * chinaPhoneNumberValidate("136 4356 4144") // => true（自动去除空格）
 * chinaPhoneNumberValidate("23643564144")  // => false（首位不是1）
 */
export function chinaPhoneNumberValidate(phoneNumber: string): boolean {
    return !!phoneNumber && /^1[0-9]{10}$/.test(phoneNumber.replace(/\s/g, ""));
}

/**
 * 邮箱格式验证
 *
 * 验证规则：
 * - 格式为 `用户名@域名.后缀`
 * - 用户名可包含字母、数字、下划线、点、连字符
 * - 域名后缀为 2-4 位字母
 * - 输入前后空格会被自动 trim 后再验证
 *
 * @param email - 待验证的邮箱地址字符串
 * @returns 验证通过返回 true，否则返回 false
 *
 * @example
 * emailValidate("test@126.com")       // => true
 * emailValidate("test.user@mail.com") // => true
 * emailValidate("test126.com")        // => false（缺少 @）
 */
export function emailValidate(email: string): boolean {
    return !!email && /^([a-zA-Z0-9_\\.\\-])+@(([a-zA-Z0-9\\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.trim());
}

/**
 * 中国身份证号码验证（支持大陆、香港、澳门、台湾）
 *
 * 验证规则：
 * - **大陆身份证**：18位，前17位为数字，最后一位为数字或X；校验位按 GB 11643-1999 标准计算
 * - **香港身份证**：格式为 `[A-Z][0-9]{6}([0-9aA])`，括号支持半角和全角
 * - **台湾身份证**：格式为 `[A-Z][1-2][0-9]{9}`，第二位为性别码（1=男，2=女）
 * - **澳门身份证**：格式为 `[157][0-9]{6}([0-9])`，括号支持半角和全角
 * - 输入前后空格会被自动 trim 后再验证
 *
 * @param IDCard - 待验证的身份证号码字符串
 * @returns 验证通过返回 true，否则返回 false
 *
 * @example
 * chinaIDCardValidate("130701199310302288")  // => true（大陆）
 * chinaIDCardValidate("B165432(8)")          // => true（香港）
 * chinaIDCardValidate("B165432167")          // => true（台湾）
 * chinaIDCardValidate("1781267(6)")          // => true（澳门）
 */
export function chinaIDCardValidate(IDCard: string): boolean {
    if (!IDCard || !IDCard.trim()) {
        return false;
    }
    IDCard = IDCard.trim();
    if (/^[a-zA-Z][0-9]{6}((（|\()[0-9aA](\)|）)|[0-9aA])$/.test(IDCard)) {
        // 香港：字母开头 + 6位数字 + 括号内校验位
        return true;
    } else if (/^[a-zA-Z][0-9]{9}$/.test(IDCard)) {
        // 台湾：字母开头 + 性别码(1或2) + 8位数字
        const genderSex: string = IDCard.substring(1, 2);
        if (genderSex === "1" || genderSex === "2") {
            return true;
        }
        return false;
    } else if (/^[157]\d{6}((（|\()[0-9](\)|）))$/.test(IDCard)) {
        // 澳门：1/5/7开头 + 6位数字 + 括号内校验位
        return true;
    } else if (/^[1-9][0-9]{5}(18|19|20)?[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/.test(IDCard)) {
        // 大陆身份证（18位，不支持15位）
        // 18位身份证需要验证最后一位校验位
        const IDCardArray: string[] = IDCard.split("");
        // ∑(ai×Wi)(mod 11) 校验算法
        /** 加权因子，对应前17位数字的权重 */
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        /** 校验位对照表，根据加权和对11取模的结果查表 */
        const parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
        /** 加权和 */
        let sum = 0;
        /** 当前位的数字值 */
        let ai = 0;
        /** 当前位的加权因子 */
        let wi = 0;
        for (let i = 0; i < 17; i++) {
            ai = parseInt(IDCardArray[i], 10);
            wi = factor[i];
            sum += ai * wi;
        }
        /** 根据加权和计算出的校验位 */
        const last = String(parity[sum % 11]);
        if (last !== IDCardArray[17].toLocaleUpperCase()) {
            return false;
        }
        return true;
    }
    return false;
}

/**
 * 银行卡号验证
 *
 * 验证规则：
 * - 全部为数字
 * - 首位不为0
 * - 长度 10-30 位（覆盖对公/私账户，参考微信支付规范）
 * - 输入前后空格会被自动 trim 后再验证
 *
 * @param bankCard - 待验证的银行卡号字符串
 * @returns 验证通过返回 true，否则返回 false
 *
 * @example
 * validateBankCard("6222021234567890123")  // => true
 * validateBankCard("123456789")            // => false（不足10位）
 * validateBankCard("0234567890")           // => false（首位为0）
 */
export function validateBankCard(bankCard: string): boolean {
    if (!bankCard) return false;
    return /^[1-9][0-9]{9,29}$/.test(bankCard.trim());
}

/**
 * 中国姓名验证
 *
 * 验证规则（满足以下任一即可）：
 * - 全汉字：2-20个汉字字符
 * - 汉字间有间隔号（·）：如 "艾格里·买买提"
 * - 全英文：2-20个英文字母，单词间可用空格分隔
 *
 * 不允许的情况：中英文混合、中文含空格、间隔号在首尾、单个字符
 * 输入前后空格会被自动 trim 后再验证
 *
 * @param name - 待验证的姓名字符串
 * @returns 验证通过返回 true，否则返回 false
 *
 * @example
 * validateName("张三")           // => true
 * validateName("艾格里·买买提")   // => true
 * validateName("jack yu")        // => true
 * validateName("测 试")          // => false（中文含空格）
 */
export function validateName(name: string): boolean {
    if (!name) return false;
    return /(^[一-龥]{1}[一-龥\\·]{0,18}[一-龥]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,18}[a-zA-Z]{1}$)/.test(name.trim());
}

/**
 * 全汉文验证
 *
 * 验证字符串是否全部由汉文（CJK 统一表意文字）组成。
 * 汉文包括汉语、日本语、朝鲜语、韩国语的书写系统中的一种文字。
 * 使用 Unicode 属性转义 `\p{Unified_Ideograph}` 进行匹配。
 *
 * @param word - 待验证的字符串
 * @returns 全部为汉文时返回 true，否则返回 false
 *
 * @example
 * validateChineseCharacter("测试")     // => true
 * validateChineseCharacter("测试䳸鿏") // => true（含扩展汉字）
 * validateChineseCharacter("测试abc")  // => false
 */
export function validateChineseCharacter(word: string): boolean {
    if (!word) return false;
    return /^[\p{Unified_Ideograph}]+$/gu.test(word);
}

/**
 * 密码格式验证
 *
 * 验证规则：
 * - 长度 8-20 位
 * - 必须同时包含以下四种字符类型：数字、小写字母、大写字母、特殊字符（非字母数字且非空白字符）
 *
 * @param password - 待验证的密码字符串
 * @returns 符合规则返回 true，否则返回 false
 *
 * @example
 * validatePassword("1W2D8^yu123edc")  // => true（含数字、小写、大写、特殊字符）
 * validatePassword("0123456789")       // => false（只有数字）
 * validatePassword("1Aa@123")          // => false（不足8位）
 */
export function validatePassword(password: string): boolean {
    return /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s])^([0-9A-Za-z]|[^\w\s]){8,20}$/.test(password);
}

/**
 * 统一社会信用代码验证（严格模式）
 *
 * 验证规则：
 * 1. 统一代码由18位的阿拉伯数字或大写英文字母组成（不使用 I、O、Z、S、V）
 * 2. 第1位：登记管理部门代码
 * 3. 第2位：机构类别代码
 * 4. 第3位~第8位：登记管理机关行政区划码（必须为数字）
 * 5. 第9位~第17位：主体标识码（组织机构代码）
 * 6. 第18位：校验码，按 GB 32100-2015 标准计算
 *
 * 实现逻辑：
 * 1. 先用正则验证格式（前2位+6位数字+10位字母数字）
 * 2. 再按校验码算法验证：C18 = CHARTS[31 - (∑(ai × 3^i mod 31)) mod 31]
 *
 * @param code - 待验证的统一社会信用代码字符串
 * @returns 验证通过返回 true，否则返回 false
 *
 * @example
 * validateSocialCreditCode("91350100M000100Y43")  // => true
 * validateSocialCreditCode("91350100M000100Y41")  // => false（校验码错误）
 */
export function validateSocialCreditCode(code: string): boolean {
    if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(code)) {
        return false;
    }
    /** 代码字符集，不含 I、O、S、V、Z */
    const CHARTS = "0123456789ABCDEFGHJKLMNPQRTUWXY";
    /** 前17位字符的权重与加权因子相乘之和 */
    const totalCode = code
        .split("")
        .slice(0, 17)
        .reduce((total, value, index) => {
            return total + CHARTS.indexOf(value) * (Math.pow(3, index) % 31);
        }, 0);
    /** 校验码：CHARTS[31 - (totalCode mod 31)] */
    return code.slice(-1) === CHARTS[31 - (totalCode % 31)];
}

/**
 * 统一社会信用代码验证（宽松匹配）
 *
 * 仅验证长度和字符组成，不校验校验码：
 * - 支持 15位、18位、20位 三种长度
 * - 字符仅允许数字和大写/小写字母
 *
 * @param code - 待验证的统一社会信用代码字符串
 * @returns 验证通过返回 true，否则返回 false
 *
 * @example
 * validateSimpleSocialCreditCode("91350100M000100")      // => true（15位）
 * validateSimpleSocialCreditCode("91350100M000100Y43")    // => true（18位）
 * validateSimpleSocialCreditCode("91350100M000100Y43IO")  // => true（20位）
 * validateSimpleSocialCreditCode("91350100M000100Y")      // => false（16位不支持）
 */
export function validateSimpleSocialCreditCode(code: string): boolean {
    return /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/.test(code);
}
