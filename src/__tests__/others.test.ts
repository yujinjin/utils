/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 16:08:16
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-05-20 09:48:45
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
            // time：           [280698, 280966, 281384, 282233, 282800]
            // nextTime-before：[280666, 280966, 281266, 282233, 282800]
            // nextTime-after： [280966, 281266, 281566, 282233, 282800]
            // 触发1000次，实际执行
            while (i < 1000) {
                ++i;
                increaseTime = parseInt((1000 * Math.random()).toFixed(1), 10);
                time += increaseTime;
                if (increaseTime === 0 && time === nextTime) {
                    // 对于增长为0，且当前时间大于下次执行时间的
                    // 例如：执行的时间是[5, 200, 300, 1305, 1305, 1605, 1615]的情况时）
                    // 实际执行的时间是: [0, 300, 1305, 1605, 1905]
                    ++runTimes;
                    nextTime += 300;
                } else if (time > nextTime) {
                    ++runTimes;
                    if (time >= nextTime + 300) {
                        nextTime = time;
                    } else {
                        nextTime += 300;
                    }
                    // console.info("03:" + nextTime);
                }
                setTimeout(execute, time);
            }

            vi.advanceTimersByTime(time + 1000);
            expect(run).toHaveBeenCalledTimes(runTimes);

            // [5, 200, 300, 1305, 1305, 1605].forEach(item => {
            //     setTimeout(execute, item);
            // });
            // vi.advanceTimersByTime(10000);
            // expect(run).toHaveBeenCalledTimes(4);

            vi.useRealTimers();
        });

        test("throttle { leading: false, tailing: true }", async () => {
            vi.useFakeTimers();
            const run = vi.fn();
            const execute = throttle(run, 300, { leading: false, trailing: true });
            // 函数执行次数
            let runTimes = 0;
            // 下次执行时间
            let nextTime = 0;
            // 定时器时间
            let time = 0;
            // 测试程序执行次数
            let i = 0;
            // 触发1000次，实际执行
            while (i < 1000) {
                ++i;
                time += parseInt((1000 * Math.random()).toFixed(1), 10);
                if (time > nextTime) {
                    ++runTimes;
                    nextTime = time + 300;
                    //nextTime = (parseInt((time / 300).toString(), 10) + (time % 300 === 0 ? 0 : 1)) * 300;
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
            // 函数执行次数
            let runTimes = 1;
            // 下次执行时间
            let nextTime = 0;
            // 定时器时间
            let time = 0;
            // 测试程序执行次数
            let i = 0;
            // 触发1000次，实际执行
            while (i < 1000) {
                ++i;
                time += parseInt((1000 * Math.random()).toFixed(1), 10);
                if (time >= nextTime + 300) {
                    ++runTimes;
                    nextTime = time;
                    //nextTime = (parseInt((time / 300).toString(), 10) + (time % 300 === 0 ? 0 : 1)) * 300;
                }
                setTimeout(execute, time);
            }
            vi.advanceTimersByTime(time + 1000);
            expect(run).toHaveBeenCalledTimes(runTimes);
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
            // 函数执行次数
            let runTimes = 0;
            // 下次执行时间
            let nextTime = 0;
            // 定时器时间
            let time = 0;
            // 测试程序执行次数
            let i = 0;
            // 触发1000次，实际执行
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
    });
    /******************************** getObjectProperty end *******************************/
});
