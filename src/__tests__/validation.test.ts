/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-24 15:29:09
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-03-28 10:54:58
 * @项目的路径: \CMS-components\packages\utils\__tests__\validation.test.ts
 * @描述: 验证工具类方法测试用例
 */
import { describe, expect, it } from "vitest";
import { chinaPhoneNumberValidate, emailValidate, chinaIDCardValidate, validateBankCard, validateName } from "../index";

describe("utils validation", () => {
    /******************************** chinaPhoneNumberValidate start *******************************/
    describe("chinaPhoneNumberValidate testing", () => {
        it("正确数据：中国手机号码验证-11位数字，首字母是1", () => {
            expect(chinaPhoneNumberValidate("13643564144")).toBeTruthy();
        });
        it("错误数据：中国手机号码验证-11位其中有非数字字符", () => {
            expect(chinaPhoneNumberValidate("1364356414A")).toBeFalsy();
        });
        it("错误数据：中国手机号码验证-11位数字，首字母不是1", () => {
            expect(chinaPhoneNumberValidate("23643564144")).toBeFalsy();
        });
    });
    /******************************** chinaPhoneNumberValidate end *******************************/

    /******************************** emailValidate end *******************************/
    describe("emailValidate testing", () => {
        it("正确数据：邮箱格式xxx@xx.xxx", () => {
            expect(emailValidate("test@126.com")).toBeTruthy();
        });
        it("错误数据：邮箱有特殊字符", () => {
            expect(emailValidate("test)@126.com")).toBeFalsy();
        });
        it("错误数据：邮箱没有‘@’字符", () => {
            expect(emailValidate("test126.com")).toBeFalsy();
        });
    });
    /******************************** emailValidate end *******************************/

    /******************************** chinaIDCardValidate start *******************************/
    describe("chinaPhoneNumberValidate testing", () => {
        it("正确数据：18位身份证号且只有数字", () => {
            expect(chinaIDCardValidate("130701199310302288")).toBeTruthy();
        });
        it("正确数据：18位身份证号且最后一位为X", () => {
            expect(chinaIDCardValidate("52030219891209794X")).toBeTruthy();
        });
        it("正确数据：香港身份证号", () => {
            expect(chinaIDCardValidate("B165432(8)")).toBeTruthy();
        });
        it("正确数据：香港身份证号-首字母小写中文半角括号", () => {
            expect(chinaIDCardValidate("a165432（8）")).toBeTruthy();
        });
        it("正确数据：台湾身份证号", () => {
            expect(chinaIDCardValidate("B165432167")).toBeTruthy();
        });
        it("正确数据：澳门身份证号", () => {
            expect(chinaIDCardValidate("1781267(6)")).toBeTruthy();
        });
        it("正确数据：澳门身份证号-中文半角括号", () => {
            expect(chinaIDCardValidate("5781267（6）")).toBeTruthy();
        });
        it("错误数据：大陆身份证-18位数字但最后数字错误", () => {
            expect(chinaIDCardValidate("130701199310302284")).toBeFalsy();
        });
        it("错误数据：18位身份证号且最后一位为除X外的字母", () => {
            expect(chinaIDCardValidate("52030219891209794Y")).toBeFalsy();
        });
        it("错误数据：不是18位", () => {
            expect(chinaIDCardValidate("32031177070600")).toBeFalsy();
        });
        it("错误数据：18位出生日期不对", () => {
            expect(chinaIDCardValidate("130701199315302288")).toBeFalsy();
        });
        it("错误数据：含有字母", () => {
            expect(chinaIDCardValidate("5203021989120979412")).toBeFalsy();
        });
        it("错误数据：含有特殊字符", () => {
            expect(chinaIDCardValidate("520@#￥%&×302198912")).toBeFalsy();
        });
    });
    /******************************** chinaIDCardValidate end *******************************/

    /******************************** validateBankCard end *******************************/
    describe("validateBankCard testing", () => {
        it("正确数据：银行卡格式5至25位数字", () => {
            expect(validateBankCard("32432432432342432432")).toBeTruthy();
        });
        it("错误数据：银行卡有非数字字符", () => {
            expect(validateBankCard("3243243a2342")).toBeFalsy();
        });
    });
    /******************************** validateBankCard end *******************************/

    /******************************** validateName end *******************************/
    describe("validateName testing", () => {
        it("正确数据：全中文", () => {
            expect(validateName("测试")).toBeTruthy();
        });
        it("正确数据：中文之间有（·）", () => {
            expect(validateName("艾格里·买买提")).toBeTruthy();
        });
        it("正确数据：全英文", () => {
            expect(validateName("jack yu")).toBeTruthy();
        });
        it("错误数据：‘.’在最前面", () => {
            expect(validateBankCard("·艾格里·买买提·")).toBeFalsy();
        });
        it("错误数据：‘.’在最后面", () => {
            expect(validateBankCard("艾格里·买买提·")).toBeFalsy();
        });
        it("错误数据：中文有空格", () => {
            expect(validateBankCard("测 试")).toBeFalsy();
        });
        it("错误数据：中英文混合", () => {
            expect(validateBankCard("测试jackyu·")).toBeFalsy();
        });
        it("错误数据：只有一个英文字符", () => {
            expect(validateBankCard("J")).toBeFalsy();
        });
    });
    /******************************** validateName end *******************************/
});
