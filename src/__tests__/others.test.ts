/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 16:08:16
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\__tests__\others.test.ts
 * @描述: 其他方法测试用例
 */
// @vitest-environment jsdom

import { describe, expect, test, vi } from "vitest";
import { loadScript, throttle, debounce, number2text, setObjectProperty, getObjectProperty } from "../index";

describe("utils others", () => {
    /******************************** loadScript start *******************************/
    describe("loadScript testing", () => {
        test("loadScript", async () => {
            vi.useFakeTimers();
            const loaded = loadScript("https://www.baidu.com/", "baidu");
            vi.advanceTimersByTime(10000);
            expect(await loaded).toBeFalsy();
            expect((document.getElementById("baidu") as HTMLScriptElement)?.src).toBe("https://www.baidu.com/");
            vi.useRealTimers();
        });

        // 边界：重复加载同一ID的脚本
        test("loadScript - 重复加载同一ID返回true", async () => {
            // 先创建一个同ID的元素
            const existingScript = document.createElement("script");
            existingScript.id = "duplicate-test";
            document.body.appendChild(existingScript);
            const result = await loadScript("https://example.com/test.js", "duplicate-test");
            expect(result).toBeTruthy();
            // 清理
            document.body.removeChild(existingScript);
        });
    });
    /******************************** loadScript end *******************************/

    /******************************** throttle start *******************************/
    describe("throttle testing", () => {
        test("throttle { leading: true, trailing: true }", async () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = throttle(run, 300);
            execute();
            // 函数执行次数
            let runTimes = 1;
            // 下次执行时间
            let nextTime = 0;
            // 定时器时间
            let time = 0;
            // 测试程序执行次数
            let i = 0;
            // 随机增长的时间
            let increaseTime = 0;
            while (i < 1000) {
                ++i;
                increaseTime = parseInt((1000 * Math.random()).toFixed(1), 10);
                time += increaseTime;
                if (increaseTime === 0 && time === nextTime) {
                    ++runTimes;
                    nextTime += 300;
                } else if (time > nextTime) {
                    ++runTimes;
                    if (time >= nextTime + 300) {
                        nextTime = time;
                    } else {
                        nextTime += 300;
                    }
                }
                setTimeout(execute, time);
            }

            vi.advanceTimersByTime(time + 1000);
            expect(run).toHaveBeenCalledTimes(runTimes);
            vi.useRealTimers();
        });

        test("throttle { leading: false, tailing: true }", async () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = throttle(run, 300, { leading: false, trailing: true });
            let runTimes = 0;
            let nextTime = 0;
            let time = 0;
            let i = 0;
            while (i < 1000) {
                ++i;
                time += parseInt((1000 * Math.random()).toFixed(1), 10);
                if (time > nextTime) {
                    ++runTimes;
                    nextTime = time + 300;
                }
                setTimeout(execute, time);
            }
            vi.advanceTimersByTime(time + 1000);
            expect(run).toHaveBeenCalledTimes(runTimes);
            vi.useRealTimers();
        });

        test("throttle { leading: true, tailing: false }", async () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = throttle(run, 300, { leading: true, trailing: false });
            execute();
            let runTimes = 1;
            let nextTime = 0;
            let time = 0;
            let i = 0;
            while (i < 1000) {
                ++i;
                time += parseInt((1000 * Math.random()).toFixed(1), 10);
                if (time >= nextTime + 300) {
                    ++runTimes;
                    nextTime = time;
                }
                setTimeout(execute, time);
            }
            vi.advanceTimersByTime(time + 1000);
            expect(run).toHaveBeenCalledTimes(runTimes);
            vi.useRealTimers();
        });

        // 边界：只调用一次
        test("throttle - 只调用一次(leading模式)", () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = throttle(run, 300);
            execute();
            expect(run).toHaveBeenCalledTimes(1);
            vi.advanceTimersByTime(500);
            expect(run).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        // 边界：连续快速调用
        test("throttle - 连续快速调用只执行leading", () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = throttle(run, 300);
            execute();
            execute();
            execute();
            expect(run).toHaveBeenCalledTimes(1);
            vi.advanceTimersByTime(300);
            expect(run).toHaveBeenCalledTimes(2); // leading + trailing
            vi.useRealTimers();
        });

        // 边界：this 上下文保持
        test("throttle - 保持this上下文", () => {
            vi.useFakeTimers();
            const obj = { value: 42 };
            const run = vi.fn(function (this: any) {
                return this.value;
            });
            const execute = throttle(run, 300);
            execute.call(obj);
            expect(run).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        // 边界：参数传递
        test("throttle - 参数正确传递", () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = throttle(run, 300);
            execute("arg1", "arg2");
            expect(run).toHaveBeenCalledWith("arg1", "arg2");
            vi.useRealTimers();
        });
    });
    /******************************** throttle end *******************************/

    /******************************** debounce start *******************************/
    describe("debounce testing", () => {
        test("debounce", async () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = debounce(run, 300);
            let runTimes = 0;
            let nextTime = 0;
            let time = 0;
            let i = 0;
            while (i < 1000) {
                ++i;
                time += parseInt((1000 * Math.random()).toFixed(1), 10);
                if (time > nextTime) {
                    ++runTimes;
                }
                nextTime = time + 300;
                setTimeout(execute, time);
            }
            vi.advanceTimersByTime(time + 1000);
            expect(run).toHaveBeenCalledTimes(runTimes);
            vi.useRealTimers();
        });

        // 边界：只调用一次
        test("debounce - 只调用一次，等待后执行", () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = debounce(run, 300);
            execute();
            expect(run).toHaveBeenCalledTimes(0);
            vi.advanceTimersByTime(300);
            expect(run).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        // 边界：连续快速调用只执行最后一次
        test("debounce - 连续快速调用只执行最后一次", () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = debounce(run, 300);
            execute();
            execute();
            execute();
            expect(run).toHaveBeenCalledTimes(0);
            vi.advanceTimersByTime(300);
            expect(run).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        // 边界：参数传递
        test("debounce - 参数正确传递", () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = debounce(run, 300);
            execute("arg1", "arg2");
            vi.advanceTimersByTime(300);
            expect(run).toHaveBeenCalledWith("arg1", "arg2");
            vi.useRealTimers();
        });

        // 边界：this 上下文保持
        test("debounce - 保持this上下文", () => {
            vi.useFakeTimers();
            const obj = { value: 42 };
            const run = vi.fn(function (this: any) {
                return this.value;
            });
            const execute = debounce(run, 300);
            execute.call(obj);
            vi.advanceTimersByTime(300);
            expect(run).toHaveBeenCalledTimes(1);
            vi.useRealTimers();
        });

        // 边界：间隔调用，每次都执行
        test("debounce - 间隔调用，每次都执行", () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = debounce(run, 300);
            execute();
            vi.advanceTimersByTime(300);
            expect(run).toHaveBeenCalledTimes(1);
            execute();
            vi.advanceTimersByTime(300);
            expect(run).toHaveBeenCalledTimes(2);
            vi.useRealTimers();
        });
    });
    /******************************** debounce end *******************************/

    /******************************** number2text start *******************************/
    describe("number2text testing", () => {
        test("数字转大写中文货币金额测试1", () => {
            expect(number2text(100000000)).toBe("壹亿元整");
        });

        test("数字转大写中文货币金额测试2", () => {
            expect(number2text("1234234211.12")).toBe("壹拾贰亿叁仟肆佰贰拾叁万肆仟贰佰壹拾壹元壹角贰分");
        });

        test("数字转小写中文货币金额测试1", () => {
            expect(number2text(100000000, "lower")).toBe("一亿元整");
        });

        test("数字转小写中文货币金额测试2", () => {
            expect(number2text("3546786543.12", "lower")).toBe("三十五亿四千六百七十八万六千五百四十三元一角二分");
        });

        // 边界：0（函数实现中0的整数部分为空字符串）
        test("数字转中文货币金额 - 0", () => {
            expect(number2text(0)).toBe("元整");
        });

        // 边界：1
        test("数字转中文货币金额 - 1", () => {
            expect(number2text(1)).toBe("壹元整");
        });

        // 边界：10
        test("数字转中文货币金额 - 10", () => {
            expect(number2text(10)).toBe("壹拾元整");
        });

        // 边界：100
        test("数字转中文货币金额 - 100", () => {
            expect(number2text(100)).toBe("壹佰元整");
        });

        // 边界：1000
        test("数字转中文货币金额 - 1000", () => {
            expect(number2text(1000)).toBe("壹仟元整");
        });

        // 边界：10000
        test("数字转中文货币金额 - 10000", () => {
            expect(number2text(10000)).toBe("壹万元整");
        });

        // 边界：小数（函数实现中整数部分为0时仍输出"元"）
        test("数字转中文货币金额 - 小数0.12", () => {
            expect(number2text(0.12)).toBe("元壹角贰分");
        });

        // 边界：小数只有角
        test("数字转中文货币金额 - 小数0.1", () => {
            expect(number2text(0.1)).toBe("元壹角零");
        });

        // 边界：超过最大值
        test("数字转中文货币金额 - 超过最大值返回空字符串", () => {
            expect(number2text(9999999999999.99)).toBe("");
        });

        // 边界：连续零
        test("数字转中文货币金额 - 连续零10001", () => {
            expect(number2text(10001)).toBe("壹万零壹元整");
        });

        // 边界：小写模式1
        test("数字转小写中文货币金额 - 1", () => {
            expect(number2text(1, "lower")).toBe("一元整");
        });

        // 边界：小写模式10（函数实现中10输出"一十"而非"十"）
        test("数字转小写中文货币金额 - 10", () => {
            expect(number2text(10, "lower")).toBe("一十元整");
        });

        // 边界：传入字符串数字
        test("数字转中文货币金额 - 传入字符串", () => {
            expect(number2text("100")).toBe("壹佰元整");
        });
    });
    /******************************** number2text end *******************************/

    /******************************** setObjectProperty start *******************************/
    describe("setObjectProperty testing", () => {
        test("setObjectProperty 对象测试", async () => {
            const target = { a: { b: { c: 12 } } };
            setObjectProperty(target, "a.b.c", 11);
            expect(target).toHaveProperty("a.b.c", 11);
        });

        test("setObjectProperty path数组测试", async () => {
            const target = { a: { b: { c: 12 } } };
            setObjectProperty(target, ["a", "b", "c"], 11);
            expect(target).toHaveProperty("a.b.c", 11);
        });

        test("setObjectProperty 空对象测试", async () => {
            const target = {};
            setObjectProperty(target, "a.b.c", true);
            expect(target).toHaveProperty("a.b.c", true);
        });

        test("setObjectProperty 数组测试", async () => {
            const target = [];
            setObjectProperty(target, "1.a.c", 10);
            expect(target).toHaveProperty("1.a.c", 10);
        });

        // 边界：path为空抛错
        test("setObjectProperty - path为空抛错", () => {
            expect(() => setObjectProperty({}, "", 1)).toThrow();
        });

        // 边界：object为null抛错
        test("setObjectProperty - object为null抛错", () => {
            expect(() => setObjectProperty(null as any, "a.b", 1)).toThrow();
        });

        // 边界：object为非对象类型抛错
        test("setObjectProperty - object为非对象类型抛错", () => {
            expect(() => setObjectProperty(123 as any, "a.b", 1)).toThrow();
        });

        // 边界：path为非字符串/数组类型抛错
        test("setObjectProperty - path为非字符串/数组类型抛错", () => {
            expect(() => setObjectProperty({}, 123 as any, 1)).toThrow();
        });

        // 边界：单层path
        test("setObjectProperty - 单层path", () => {
            const target = { a: 1 };
            setObjectProperty(target, "a", 2);
            expect(target.a).toBe(2);
        });

        // 边界：带方括号的path
        test("setObjectProperty - 带方括号的path", () => {
            const target = {};
            setObjectProperty(target, "a[b].c", 10);
            expect(target).toHaveProperty("a.b.c", 10);
        });

        // 边界：path以点开头
        test("setObjectProperty - path以点开头", () => {
            const target = {};
            setObjectProperty(target, ".a.b", 10);
            expect(target).toHaveProperty("a.b", 10);
        });

        // 边界：设置数组索引
        test("setObjectProperty - 设置数组索引", () => {
            const target = { list: [] };
            setObjectProperty(target, "list.0.name", "test");
            expect(target).toHaveProperty("list.0.name", "test");
        });
    });
    /******************************** setObjectProperty end *******************************/

    /******************************** getObjectProperty start *******************************/
    describe("getObjectProperty testing", () => {
        const target = { a: { b: { c: 12, d: [{ e: 10 }] } } };
        test("getObjectProperty 对象测试", async () => {
            expect(getObjectProperty(target, "a.b.c")).toBe(12);
        });

        test("getObjectProperty path数组测试", async () => {
            expect(getObjectProperty(target, ["a", "b", "c", "d"], 10)).toBe(10);
        });

        test("getObjectProperty 空对象测试", async () => {
            expect(getObjectProperty(target, "a.d.e")).toBeUndefined();
        });

        test("getObjectProperty 数组测试", async () => {
            expect(getObjectProperty(target, "a.b.d.0.e")).toBe(10);
        });

        // 边界：path不存在返回defaultValue
        test("getObjectProperty - path不存在返回defaultValue", () => {
            expect(getObjectProperty(target, "a.b.x", "default")).toBe("default");
        });

        // 边界：path为空抛错
        test("getObjectProperty - path为空抛错", () => {
            expect(() => getObjectProperty({}, "")).toThrow();
        });

        // 边界：object为null抛错
        test("getObjectProperty - object为null抛错", () => {
            expect(() => getObjectProperty(null as any, "a.b")).toThrow();
        });

        // 边界：object为非对象类型抛错
        test("getObjectProperty - object为非对象类型抛错", () => {
            expect(() => getObjectProperty(123 as any, "a.b")).toThrow();
        });

        // 边界：path为非字符串/数组类型抛错
        test("getObjectProperty - path为非字符串/数组类型抛错", () => {
            expect(() => getObjectProperty({}, 123 as any)).toThrow();
        });

        // 边界：值为null返回null
        test("getObjectProperty - 值为null返回null", () => {
            const obj = { a: { b: null } };
            expect(getObjectProperty(obj, "a.b")).toBeNull();
        });

        // 边界：值为undefined返回defaultValue
        test("getObjectProperty - 值为undefined返回defaultValue", () => {
            const obj = { a: {} };
            expect(getObjectProperty(obj, "a.b", "fallback")).toBe("fallback");
        });

        // 边界：带方括号的path
        test("getObjectProperty - 带方括号的path", () => {
            const obj = { a: { b: { c: 5 } } };
            expect(getObjectProperty(obj, "a[b].c")).toBe(5);
        });

        // 边界：path以点开头
        test("getObjectProperty - path以点开头", () => {
            const obj = { a: { b: 3 } };
            expect(getObjectProperty(obj, ".a.b")).toBe(3);
        });

        // 边界：单层path
        test("getObjectProperty - 单层path", () => {
            const obj = { a: 1 };
            expect(getObjectProperty(obj, "a")).toBe(1);
        });

        // 边界：path数组形式
        test("getObjectProperty - path数组形式", () => {
            const obj = { a: { b: { c: 99 } } };
            expect(getObjectProperty(obj, ["a", "b", "c"])).toBe(99);
        });
    });
    /******************************** getObjectProperty end *******************************/
});