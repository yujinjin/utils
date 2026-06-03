/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-24 15:29:09
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\__tests__\validation.test.ts
 * @描述: 验证工具类方法测试用例
 */
import { describe, expect, test } from "vitest";
import {
    chinaPhoneNumberValidate,
    emailValidate,
    chinaIDCardValidate,
    validateBankCard,
    validateName,
    validateChineseCharacter,
    validatePassword,
    validateSocialCreditCode,
    validateSimpleSocialCreditCode
} from "../index";

describe("utils validation", () => {
    /******************************** chinaPhoneNumberValidate start *******************************/
    describe("chinaPhoneNumberValidate testing", () => {
        test("正确数据：中国手机号码验证-11位数字，首字母是1", () => {
            expect(chinaPhoneNumberValidate("13643564144")).toBeTruthy();
        });
        test("错误数据：中国手机号码验证-11位其中有非数字字符", () => {
            expect(chinaPhoneNumberValidate("1364356414A")).toBeFalsy();
        });
        test("错误数据：中国手机号码验证-11位数字，首字母不是1", () => {
            expect(chinaPhoneNumberValidate("23643564144")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(chinaPhoneNumberValidate("")).toBeFalsy();
        });

        // 边界：号码中含空格（应自动去除后验证）
        test("正确数据：号码中含空格", () => {
            expect(chinaPhoneNumberValidate("136 4356 4144")).toBeTruthy();
        });

        // 边界：不足11位
        test("错误数据：不足11位", () => {
            expect(chinaPhoneNumberValidate("1364356414")).toBeFalsy();
        });

        // 边界：超过11位
        test("错误数据：超过11位", () => {
            expect(chinaPhoneNumberValidate("136435641441")).toBeFalsy();
        });

        // 边界：所有第二位数字
        test("正确数据：第二位为0", () => {
            expect(chinaPhoneNumberValidate("10643564144")).toBeTruthy();
        });
        test("正确数据：第二位为9", () => {
            expect(chinaPhoneNumberValidate("19643564144")).toBeTruthy();
        });
    });
    /******************************** chinaPhoneNumberValidate end *******************************/

    /******************************** emailValidate start *******************************/
    describe("emailValidate testing", () => {
        test("正确数据：邮箱格式xxx@xx.xxx", () => {
            expect(emailValidate("test@126.com")).toBeTruthy();
        });
        test("错误数据：邮箱有特殊字符", () => {
            expect(emailValidate("test)@126.com")).toBeFalsy();
        });
        test("错误数据：邮箱没有'@'字符", () => {
            expect(emailValidate("test126.com")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(emailValidate("")).toBeFalsy();
        });

        // 边界：邮箱前后有空格（应trim后验证）
        test("正确数据：邮箱前后有空格", () => {
            expect(emailValidate("  test@126.com  ")).toBeTruthy();
        });

        // 边界：多级域名
        test("正确数据：多级域名", () => {
            expect(emailValidate("test@mail.example.com")).toBeTruthy();
        });

        // 边界：用户名含点
        test("正确数据：用户名含点", () => {
            expect(emailValidate("test.user@126.com")).toBeTruthy();
        });

        // 边界：用户名含连字符
        test("正确数据：用户名含连字符", () => {
            expect(emailValidate("test-user@126.com")).toBeTruthy();
        });

        // 边界：用户名含下划线
        test("正确数据：用户名含下划线", () => {
            expect(emailValidate("test_user@126.com")).toBeTruthy();
        });

        // 边界：只有@符号
        test("错误数据：只有@符号", () => {
            expect(emailValidate("@")).toBeFalsy();
        });

        // 边界：@后无域名
        test("错误数据：@后无域名", () => {
            expect(emailValidate("test@")).toBeFalsy();
        });

        // 边界：域名后缀过短
        test("错误数据：域名后缀只有1位", () => {
            expect(emailValidate("test@126.c")).toBeFalsy();
        });

        // 边界：域名后缀过长（当前正则允许2-4位，com123 被视为 com1 域名 + 23 后缀）
        test("正确数据：域名后缀com123（正则宽松匹配）", () => {
            expect(emailValidate("test@126.com123")).toBeTruthy();
        });
    });
    /******************************** emailValidate end *******************************/

    /******************************** chinaIDCardValidate start *******************************/
    describe("chinaIDCardValidate testing", () => {
        test("正确数据：18位身份证号且只有数字", () => {
            expect(chinaIDCardValidate("130701199310302288")).toBeTruthy();
        });
        test("正确数据：18位身份证号且最后一位为X", () => {
            expect(chinaIDCardValidate("52030219891209794X")).toBeTruthy();
        });
        test("正确数据：香港身份证号", () => {
            expect(chinaIDCardValidate("B165432(8)")).toBeTruthy();
        });
        test("正确数据：香港身份证号-首字母小写中文半角括号", () => {
            expect(chinaIDCardValidate("a165432（8）")).toBeTruthy();
        });
        test("正确数据：台湾身份证号", () => {
            expect(chinaIDCardValidate("B165432167")).toBeTruthy();
        });
        test("正确数据：澳门身份证号", () => {
            expect(chinaIDCardValidate("1781267(6)")).toBeTruthy();
        });
        test("正确数据：澳门身份证号-中文半角括号", () => {
            expect(chinaIDCardValidate("5781267（6）")).toBeTruthy();
        });
        test("错误数据：大陆身份证-18位数字但最后数字错误", () => {
            expect(chinaIDCardValidate("130701199310302284")).toBeFalsy();
        });
        test("错误数据：18位身份证号且最后一位为除X外的字母", () => {
            expect(chinaIDCardValidate("52030219891209794Y")).toBeFalsy();
        });
        test("错误数据：不是18位", () => {
            expect(chinaIDCardValidate("32031177070600")).toBeFalsy();
        });
        test("错误数据：18位出生日期不对", () => {
            expect(chinaIDCardValidate("130701199315302288")).toBeFalsy();
        });
        test("错误数据：含有字母", () => {
            expect(chinaIDCardValidate("5203021989120979412")).toBeFalsy();
        });
        test("错误数据：含有特殊字符", () => {
            expect(chinaIDCardValidate("520@#￥%&×302198912")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(chinaIDCardValidate("")).toBeFalsy();
        });

        // 边界：只有空格
        test("错误数据：只有空格", () => {
            expect(chinaIDCardValidate("   ")).toBeFalsy();
        });

        // 边界：前后有空格（应trim后验证）
        test("正确数据：前后有空格", () => {
            expect(chinaIDCardValidate(" 130701199310302288 ")).toBeTruthy();
        });

        // 边界：最后一位为小写x
        test("正确数据：最后一位为小写x", () => {
            expect(chinaIDCardValidate("52030219891209794x")).toBeTruthy();
        });

        // 边界：台湾身份证第二位不是1或2
        test("错误数据：台湾身份证第二位不是1或2", () => {
            expect(chinaIDCardValidate("B365432167")).toBeFalsy();
        });
    });
    /******************************** chinaIDCardValidate end *******************************/

    /******************************** validateBankCard start *******************************/
    describe("validateBankCard testing", () => {
        test("正确数据：银行卡格式10位数字", () => {
            expect(validateBankCard("1234567890")).toBeTruthy();
        });
        test("正确数据：银行卡格式30位数字", () => {
            expect(validateBankCard("123456789012345678901234567890")).toBeTruthy();
        });
        test("错误数据：银行卡有非数字字符", () => {
            expect(validateBankCard("3243243a2342")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(validateBankCard("")).toBeFalsy();
        });

        // 边界：不足10位
        test("错误数据：不足10位", () => {
            expect(validateBankCard("123456789")).toBeFalsy();
        });

        // 边界：超过30位
        test("错误数据：超过30位", () => {
            expect(validateBankCard("1234567890123456789012345678901")).toBeFalsy();
        });

        // 边界：首位为0
        test("错误数据：首位为0", () => {
            expect(validateBankCard("0234567890")).toBeFalsy();
        });

        // 边界：前后有空格（应trim后验证）
        test("正确数据：前后有空格", () => {
            expect(validateBankCard(" 1234567890 ")).toBeTruthy();
        });
    });
    /******************************** validateBankCard end *******************************/

    /******************************** validateName start *******************************/
    describe("validateName testing", () => {
        test("正确数据：全中文", () => {
            expect(validateName("测试")).toBeTruthy();
        });
        test("正确数据：中文之间有（·）", () => {
            expect(validateName("艾格里·买买提")).toBeTruthy();
        });
        test("正确数据：全英文", () => {
            expect(validateName("jack yu")).toBeTruthy();
        });
        test("错误数据：有中文标点符号", () => {
            expect(validateName("艾格里买？买提")).toBeFalsy();
        });
        test("错误数据：有中文标点符号", () => {
            expect(validateName("艾格里买？买提")).toBeFalsy();
        });
        test("错误数据：有日文", () => {
            expect(validateName("は艾格里·买买提·")).toBeFalsy();
        });
        test("错误数据：有最近新增加的汉字", () => {
            expect(validateName("䳸鿏")).toBeFalsy();
        });
        test("错误数据：'·'在最前面", () => {
            expect(validateName("·艾格里·买买提·")).toBeFalsy();
        });
        test("错误数据：'·'在最后面", () => {
            expect(validateName("艾格里·买买提·")).toBeFalsy();
        });
        test("错误数据：中文有空格", () => {
            expect(validateName("测 试")).toBeFalsy();
        });
        test("错误数据：中英文混合", () => {
            expect(validateName("测试jackyu·")).toBeFalsy();
        });
        test("错误数据：只有一个英文字符", () => {
            expect(validateName("J")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(validateName("")).toBeFalsy();
        });

        // 边界：纯空格
        test("错误数据：纯空格", () => {
            expect(validateName("   ")).toBeFalsy();
        });

        // 边界：两个中文字符
        test("正确数据：两个中文字符", () => {
            expect(validateName("张三")).toBeTruthy();
        });

        // 边界：两个英文字符
        test("正确数据：两个英文字符", () => {
            expect(validateName("Ab")).toBeTruthy();
        });

        // 边界：20位中文（最大长度）
        test("正确数据：20位中文", () => {
            expect(validateName("一二三四五六七八九十一二三四五六七八九十")).toBeTruthy();
        });

        // 边界：超过20位中文
        test("错误数据：超过20位中文", () => {
            expect(validateName("一二三四五六七八九十一二三四五六七八九十一")).toBeFalsy();
        });
    });
    /******************************** validateName end *******************************/

    /******************************** validateChineseCharacter start *******************************/
    describe("validateChineseCharacter testing", () => {
        test("正确数据：全中文", () => {
            expect(validateChineseCharacter("测试")).toBeTruthy();
        });
        test("正确数据：有中文以及新加的汉字", () => {
            expect(validateChineseCharacter("测试䳸鿏")).toBeTruthy();
        });
        test("错误数据：有中文标点符号", () => {
            expect(validateChineseCharacter("测？试")).toBeFalsy();
        });
        test("错误数据：大写的数学符号 X", () => {
            expect(validateChineseCharacter("测𝒳试")).toBeFalsy();
        });
        test("错误数据：中英文混合", () => {
            expect(validateChineseCharacter("测试jackyu")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(validateChineseCharacter("")).toBeFalsy();
        });

        // 边界：单个汉字
        test("正确数据：单个汉字", () => {
            expect(validateChineseCharacter("测")).toBeTruthy();
        });

        // 边界：含数字
        test("错误数据：含数字", () => {
            expect(validateChineseCharacter("测试1")).toBeFalsy();
        });

        // 边界：含空格
        test("错误数据：含空格", () => {
            expect(validateChineseCharacter("测 试")).toBeFalsy();
        });
    });
    /******************************** validateChineseCharacter end *******************************/

    /******************************** validatePassword start *******************************/
    describe("validatePassword testing", () => {
        test("正确数据：密码内容长度14位，有数字、小写字母、大写字母、^特殊字符这四种组合", () => {
            expect(validatePassword("1W2D8^yu123edc")).toBeTruthy();
        });
        test("正确数据：密码内容长度12位，有数字、小写字母、大写字母、中文特殊字符这四种组合", () => {
            expect(validatePassword("WD8yu12测3edc")).toBeTruthy();
        });
        test("错误数据：密码内容长度14位，有数字、小写字母、大写字母、*特殊字符这四种组合之外还有一个换行符'\\n'", () => {
            expect(validatePassword("WD8yu*1\n2f3edc")).toBeFalsy();
        });
        test("错误数据：密码内容长度14位，有数字、小写字母、大写字母、*特殊字符这四种组合之外还有空格", () => {
            expect(validatePassword("WD8yu*1 2f3edc")).toBeFalsy();
        });
        test("错误数据：密码内容长度21位，有数字、小写字母、大写字母、中文特殊字符这四种组合", () => {
            expect(validatePassword("1W2D8^yu12GSWAQO3edc测")).toBeFalsy();
        });
        test("错误数据：密码内容长度21位，有数字、小写字母、大写字母、中文特殊字符这四种组合", () => {
            expect(validatePassword("1W2D8^yu12GSWAQO3edc测")).toBeFalsy();
        });
        test("错误数据：密码内容长度12位，只有数字、小写字母、大写字母这三种组合", () => {
            expect(validatePassword("WD8yu12f3edc")).toBeFalsy();
        });
        test("错误数据：密码内容长度10位，只有中文特殊字、小写字母这两种组合", () => {
            expect(validatePassword("这是个测试jackyu")).toBeFalsy();
        });
        test("错误数据：密码内容长度10位，只有数字这一种组合", () => {
            expect(validatePassword("0123456789")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(validatePassword("")).toBeFalsy();
        });

        // 边界：刚好8位（满足四种组合）
        test("正确数据：刚好8位满足四种组合", () => {
            expect(validatePassword("1Aa@1234")).toBeTruthy();
        });

        // 边界：只有小写字母
        test("错误数据：只有小写字母", () => {
            expect(validatePassword("abcdefgh")).toBeFalsy();
        });

        // 边界：只有大写字母
        test("错误数据：只有大写字母", () => {
            expect(validatePassword("ABCDEFGH")).toBeFalsy();
        });

        // 边界：只有特殊字符
        test("错误数据：只有特殊字符", () => {
            expect(validatePassword("!@#$%^&*")).toBeFalsy();
        });

        // 边界：7位（不足8位）
        test("错误数据：7位密码", () => {
            expect(validatePassword("1Aa@123")).toBeFalsy();
        });
    });
    /******************************** validatePassword end *******************************/

    /******************************** validateSocialCreditCode start *******************************/
    describe("validateSocialCreditCode testing", () => {
        test("正确数据：91350100M000100Y43", () => {
            expect(validateSocialCreditCode("91350100M000100Y43")).toBeTruthy();
        });
        test("错误数据：最后一位的校验码错误", () => {
            expect(validateSocialCreditCode("91350100M000100Y41")).toBeFalsy();
        });
        test("错误数据：统一社会信用代码含I、O、S、V、Z字符", () => {
            expect(validateSocialCreditCode("9I350100M000100Y41")).toBeFalsy();
        });
        test("错误数据：统一社会信用代码中第3位~第8位不是数字", () => {
            expect(validateSocialCreditCode("91A50100M000100Y43")).toBeFalsy();
        });
        test("错误数据：统一社会信用代码不是18位", () => {
            expect(validateSocialCreditCode("91350100M000100Y434")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(validateSocialCreditCode("")).toBeFalsy();
        });

        // 边界：小写字母
        test("错误数据：含小写字母", () => {
            expect(validateSocialCreditCode("91350100m000100y43")).toBeFalsy();
        });

        // 边界：含特殊字符
        test("错误数据：含特殊字符", () => {
            expect(validateSocialCreditCode("91350100M000100Y4*")).toBeFalsy();
        });

        // 边界：17位
        test("错误数据：17位", () => {
            expect(validateSocialCreditCode("91350100M000100Y4")).toBeFalsy();
        });

        // 边界：19位
        test("错误数据：19位", () => {
            expect(validateSocialCreditCode("91350100M000100Y434")).toBeFalsy();
        });
    });
    /******************************** validateSocialCreditCode end *******************************/

    /******************************** validateSimpleSocialCreditCode start *******************************/
    describe("validateSimpleSocialCreditCode testing", () => {
        test("正确数据：15位-91350100M000100", () => {
            expect(validateSimpleSocialCreditCode("91350100M000100")).toBeTruthy();
        });
        test("正确数据：18位-91350100M000100Y43", () => {
            expect(validateSimpleSocialCreditCode("91350100M000100Y43")).toBeTruthy();
        });
        test("正确数据：20位-91350100M000100Y43IO", () => {
            expect(validateSimpleSocialCreditCode("91350100M000100Y43IO")).toBeTruthy();
        });
        test("错误数据：16位-91350100M000100Y", () => {
            expect(validateSimpleSocialCreditCode("91350100M000100Y")).toBeFalsy();
        });
        test("错误数据：除数字和大写字母外的字符-特殊字符", () => {
            expect(validateSimpleSocialCreditCode("91A50100M000100*43")).toBeFalsy();
        });

        // 边界：空字符串
        test("错误数据：空字符串", () => {
            expect(validateSimpleSocialCreditCode("")).toBeFalsy();
        });

        // 边界：小写字母也允许（宽松匹配）
        test("正确数据：小写字母-15位", () => {
            expect(validateSimpleSocialCreditCode("91350100m000100")).toBeTruthy();
        });

        // 边界：14位
        test("错误数据：14位", () => {
            expect(validateSimpleSocialCreditCode("91350100M00010")).toBeFalsy();
        });

        // 边界：17位
        test("错误数据：17位", () => {
            expect(validateSimpleSocialCreditCode("91350100M000100Y4")).toBeFalsy();
        });

        // 边界：19位
        test("错误数据：19位", () => {
            expect(validateSimpleSocialCreditCode("91350100M000100Y43I")).toBeFalsy();
        });

        // 边界：21位
        test("错误数据：21位", () => {
            expect(validateSimpleSocialCreditCode("91350100M000100Y43IO1")).toBeFalsy();
        });
    });
    /******************************** validateSimpleSocialCreditCode end *******************************/
});
