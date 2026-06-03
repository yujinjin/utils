/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 10:54:11
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\__tests__\extend.test.ts
 * @描述: 对象复制测试用例
 */
import { describe, expect, test } from "vitest";
import { extend } from "../index";

describe("utils extend", () => {
    // ========== 浅复制 ==========
    test("普通对象浅复制", () => {
        expect(extend({ a: { i: 1, j: 2 }, b: 2, c: 3 }, { a: { k: 3 }, d: 2 })).toStrictEqual({
            a: { k: 3 },
            b: 2,
            c: 3,
            d: 2
        });
    });

    test("普通对象带日期浅复制", () => {
        expect(extend({ a: new Date(1679985154772), b: 2 }, { a: new Date(1679985150000), d: 2 })).toStrictEqual({
            a: new Date(1679985150000),
            b: 2,
            d: 2
        });
    });

    test("对象数组浅复制", () => {
        expect(extend({ a: { i: 1, j: 2 }, b: 2, c: 3 }, [{ a: 1, b: 2 }])).toStrictEqual({
            0: { a: 1, b: 2 },
            a: { i: 1, j: 2 },
            b: 2,
            c: 3
        });
    });

    test("浅复制 - 嵌套对象直接覆盖而非合并", () => {
        const target = { a: { x: 1, y: 2 } };
        const source = { a: { z: 3 } };
        const result = extend(target, source);
        expect(result).toStrictEqual({ a: { z: 3 } });
        // 浅复制下嵌套对象整体替换，不是合并
        expect(result.a).toEqual({ z: 3 });
    });

    // ========== 深复制 ==========
    test("普通对象深复制", () => {
        expect(extend(true, { a: { i: 1, j: 2 }, b: 2, c: 3 }, { a: { k: 3 }, d: 2 })).toStrictEqual({
            a: { i: 1, j: 2, k: 3 },
            b: 2,
            c: 3,
            d: 2
        });
    });

    test("数组深复制", () => {
        expect(extend(true, [{ a: { i: 1, j: 2 }, b: 2, c: 3 }], [{ a: { k: 3 }, b: 2 }, true])).toStrictEqual([
            { a: { i: 1, k: 3, j: 2 }, b: 2, c: 3 },
            true
        ]);
    });

    test("深复制 - 嵌套对象多层合并", () => {
        const target = { a: { b: { c: 1, d: 2 } } };
        const source = { a: { b: { e: 3 }, f: 4 } };
        expect(extend(true, target, source)).toStrictEqual({ a: { b: { c: 1, d: 2, e: 3 }, f: 4 } });
    });

    test("深复制 - Date 等特殊对象直接覆盖", () => {
        const date1 = new Date(2023, 0, 1);
        const date2 = new Date(2024, 5, 1);
        const result = extend(true, { a: date1 }, { a: date2 });
        expect(result.a).toBe(date2);
    });

    test("深复制 - RegExp 等特殊对象直接覆盖", () => {
        const regex1 = /abc/g;
        const regex2 = /def/i;
        const result = extend(true, { a: regex1 }, { a: regex2 });
        expect(result.a).toBe(regex2);
    });

    test("深复制 - 数组与对象混合", () => {
        const target = { a: [{ x: 1 }] };
        const source = { a: [{ y: 2 }, { z: 3 }] };
        // 数组深复制时，target.a[0] 是对象，source.a[0] 也是对象 → 合并
        // source.a[1] 是新元素
        expect(extend(true, target, source)).toStrictEqual({ a: [{ x: 1, y: 2 }, { z: 3 }] });
    });

    test("深复制 - 循环引用防护（target === copy 时跳过）", () => {
        const target: Record<string, any> = { a: 1 };
        target.self = target;
        const source = { b: 2, self: target };
        const result = extend(true, target, source);
        expect(result.b).toBe(2);
        // self 属性因为 target === copy 被跳过，保持原值
        expect(result.self).toBe(target);
    });

    test("深复制 - undefined 值不写入 target", () => {
        const target = { a: 1, b: 2 };
        const source = { b: undefined, c: 3 };
        const result = extend(true, target, source);
        expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
    });

    test("深复制 - null 的 source 被跳过", () => {
        const target = { a: 1 };
        const result = extend(true, target, null, { b: 2 }, undefined);
        expect(result).toStrictEqual({ a: 1, b: 2 });
    });

    test("深复制 - 保持引用独立（修改 source 不影响 target）", () => {
        const source = { a: { b: 1 } };
        const result = extend(true, {}, source);
        source.a.b = 999;
        expect(result.a.b).toBe(1);
    });

    test("深复制 - 数组中含对象", () => {
        const target = [{ name: "a" }];
        const source = [{ age: 1 }, { name: "b" }];
        expect(extend(true, target, source)).toStrictEqual([{ name: "a", age: 1 }, { name: "b" }]);
    });

    // ========== 边界情况 ==========
    test("空参数调用返回空对象", () => {
        expect(extend()).toStrictEqual({});
    });

    test("单个对象参数返回自身", () => {
        const obj = { a: 1 };
        expect(extend(obj)).toBe(obj);
    });

    test("target 为非对象（string）时自动转为空对象", () => {
        const result = extend("hello", { a: 1 });
        expect(result).toStrictEqual({ a: 1 });
    });

    test("target 为非对象（number）时自动转为空对象", () => {
        const result = extend(123, { a: 1 });
        expect(result).toStrictEqual({ a: 1 });
    });

    test("多个 source 对象依次合并", () => {
        const result = extend({}, { a: 1 }, { b: 2 }, { c: 3, a: 10 });
        expect(result).toStrictEqual({ a: 10, b: 2, c: 3 });
    });

    test("深复制 - 多个 source 依次合并", () => {
        const result = extend(true, {}, { a: { x: 1 } }, { a: { y: 2 }, b: 3 }, { c: 4 });
        expect(result).toStrictEqual({ a: { x: 1, y: 2 }, b: 3, c: 4 });
    });

    test("深复制 - target 中数组被 source 中对象覆盖时转为对象", () => {
        // 当 target[name] 是数组但 source[name] 是纯对象时，clone 使用空对象
        const target = { a: [1, 2] };
        const source = { a: { x: 1 } };
        expect(extend(true, target, source)).toStrictEqual({ a: { x: 1 } });
    });

    test("深复制 - target 中对象被 source 中数组覆盖时转为数组", () => {
        const target = { a: { x: 1 } };
        const source = { a: [1, 2] };
        expect(extend(true, target, source)).toStrictEqual({ a: [1, 2] });
    });
});
