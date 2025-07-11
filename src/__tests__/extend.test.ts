/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 10:54:11
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-05-20 09:39:40
 * @项目的路径: \utils\src\__tests__\extend.test.ts
 * @描述: 对象复制测试用例
 */
import { describe, expect, test } from "vitest";
import { extend } from "../index";

describe("utils extend", () => {
    test("普通对象浅复制", () => {
        expect(extend({ a: { i: 1, j: 2 }, b: 2, c: 3 }, { a: { k: 3 }, d: 2 })).toStrictEqual({ a: { k: 3 }, b: 2, c: 3, d: 2 });
    });
    test("普通对象带日期浅复制", () => {
        expect(extend({ a: new Date(1679985154772), b: 2 }, { a: new Date(1679985150000), d: 2 })).toStrictEqual({ a: new Date(1679985150000), b: 2, d: 2 });
    });
    test("对象数组浅复制", () => {
        expect(extend({ a: { i: 1, j: 2 }, b: 2, c: 3 }, [{ a: 1, b: 2 }])).toStrictEqual({ 0: { a: 1, b: 2 }, a: { i: 1, j: 2 }, b: 2, c: 3 });
    });
    test("普通对象深复制", () => {
        expect(extend(true, { a: { i: 1, j: 2 }, b: 2, c: 3 }, { a: { k: 3 }, d: 2 })).toStrictEqual({ a: { i: 1, j: 2, k: 3 }, b: 2, c: 3, d: 2 });
    });
    test("数组深复制", () => {
        expect(extend(true, [{ a: { i: 1, j: 2 }, b: 2, c: 3 }], [{ a: { k: 3 }, b: 2 }, true])).toStrictEqual([{ a: { i: 1, k: 3, j: 2 }, b: 2, c: 3 }, true]);
    });
});
