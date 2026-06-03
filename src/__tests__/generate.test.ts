/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 15:34:35
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\__tests__\generate.test.ts
 * @描述: 动态生成数据测试用例
 */
import { describe, expect, test } from "vitest";
import { guid, randomId } from "../index";

describe("utils generate", () => {
    /******************************** guid start *******************************/
    describe("guid testing", () => {
        test("guid 随机生成100个，检查重复性", () => {
            const guidArray = new Array(100).fill("").map(() => guid());
            expect(new Set(guidArray).size === guidArray.length).toBeTruthy();
        });

        // 格式验证：32位16进制，含连字符的标准UUID格式
        test("guid 格式验证 - 符合UUID格式", () => {
            const result = guid();
            // 格式：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx，全大写
            const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/;
            expect(uuidRegex.test(result)).toBeTruthy();
        });

        // 边界：结果为大写
        test("guid 结果为大写字母", () => {
            const result = guid();
            expect(result).toBe(result.toUpperCase());
        });

        // 边界：长度为36（32个16进制字符+4个连字符）
        test("guid 长度为36", () => {
            const result = guid();
            expect(result.length).toBe(36);
        });

        // 性能：批量生成1000个无重复
        test("guid 批量生成1000个无重复", () => {
            const guidArray = new Array(1000).fill("").map(() => guid());
            expect(new Set(guidArray).size).toBe(guidArray.length);
        });

        // 每次生成不同的值
        test("guid 每次生成不同的值", () => {
            const guid1 = guid();
            const guid2 = guid();
            expect(guid1).not.toBe(guid2);
        });
    });
    /******************************** guid end *******************************/

    /******************************** randomId start *******************************/
    describe("randomId testing", () => {
        test("randomId 随机生成100个，检查重复性", () => {
            const randomIdArray = new Array(100).fill("").map(() => randomId());
            expect(new Set(randomIdArray).size === randomIdArray.length).toBeTruthy();
        });

        // 格式验证：年月日+8位随机16进制
        test("randomId 格式验证 - 包含日期前缀", () => {
            const result = randomId();
            // 长度应为16位：8位日期(YYYYMMDD) + 8位随机数
            expect(result.length).toBe(16);
        });

        // 日期前缀正确
        test("randomId 日期前缀正确", () => {
            const now = new Date();
            const year = String(now.getFullYear());
            const month = String(now.getMonth() > 8 ? now.getMonth() + 1 : "0" + (1 + now.getMonth()));
            const day = String(now.getDate() > 9 ? now.getDate() : "0" + now.getDate());
            const result = randomId();
            expect(result.startsWith(year + month + day)).toBeTruthy();
        });

        // 性能：批量生成1000个无重复
        test("randomId 批量生成1000个无重复", () => {
            const randomIdArray = new Array(1000).fill("").map(() => randomId());
            expect(new Set(randomIdArray).size).toBe(randomIdArray.length);
        });

        // 每次生成不同的值
        test("randomId 每次生成不同的值", () => {
            const id1 = randomId();
            const id2 = randomId();
            expect(id1).not.toBe(id2);
        });
    });
    /******************************** randomId end *******************************/
});
