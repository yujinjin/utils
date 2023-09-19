/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 16:08:16
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-03-29 17:31:59
 * @项目的路径: \CMS-components\packages\utils\__tests__\others.test.ts
 * @描述: 其他方法测试用例
 */
import { describe, expect, it, vi } from "vitest";
import { loadScript, throttle, debounce, setObjectProperty, getObjectProperty } from "../index";

describe("utils others", () => {
    /******************************** loadScript start *******************************/
    describe("loadScript testing", () => {
        it("loadScript", async () => {
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
        it("throttle { leading: true, trailing: true }", async () => {
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
            // time：           [280698, 280966, 281384, 282233, 282800]
            // nextTime-before：[280666, 280966, 281266, 282233, 282800]
            // nextTime-after： [280966, 281266, 281566, 282233, 282800]
            // 触发1000次，实际执行
            while (i < 1000) {
                ++i;
                time += parseInt((1000 * Math.random()).toFixed(1), 10);
                if (time >= nextTime) {
                    ++runTimes;
                    if (time >= nextTime + 300) {
                        nextTime = time;
                    } else {
                        // 考虑等于的情况只会处理一次，所以这里多加个1。
                        //（举例：定时器(time)执行的时间是[0, 100, 300, 400, 600, 900, 1300]的情况时）
                        // 实际执行的时间是: [0, 300, 600, 900, 1300]
                        nextTime += 301;
                    }
                }
                setTimeout(execute, time);
            }
            vi.advanceTimersByTime(time + 1000);
            expect(run).toHaveBeenCalledTimes(runTimes);
            vi.useRealTimers();
        });

        it("throttle {leading: false, tailing: true}", async () => {
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

        it("throttle {leading: true, tailing: false}", async () => {
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
        it("debounce", async () => {
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

    /******************************** setObjectProperty start *******************************/
    describe("setObjectProperty testing", () => {
        it("setObjectProperty 对象测试", async () => {
            const target = { a: { b: { c: 12 } } };
            setObjectProperty(target, "a.b.c", 11);
            expect(target).toHaveProperty("a.b.c", 11);
        });

        it("setObjectProperty path数组测试", async () => {
            const target = { a: { b: { c: 12 } } };
            setObjectProperty(target, ["a", "b", "c"], 11);
            expect(target).toHaveProperty("a.b.c", 11);
        });

        it("setObjectProperty 空对象测试", async () => {
            const target = {};
            setObjectProperty(target, "a.b.c", true);
            expect(target).toHaveProperty("a.b.c", true);
        });

        it("setObjectProperty 数组测试", async () => {
            const target = [];
            setObjectProperty(target, "1.a.c", 10);
            expect(target).toHaveProperty("1.a.c", 10);
        });
    });
    /******************************** setObjectProperty end *******************************/

    /******************************** getObjectProperty start *******************************/
    describe("getObjectProperty testing", () => {
        const target = { a: { b: { c: 12, d: [{ e: 10 }] } } };
        it("getObjectProperty 对象测试", async () => {
            expect(getObjectProperty(target, "a.b.c")).toBe(12);
        });

        it("getObjectProperty path数组测试", async () => {
            expect(getObjectProperty(target, ["a", "b", "c", "d"], 10)).toBe(10);
        });

        it("getObjectProperty 空对象测试", async () => {
            expect(getObjectProperty(target, "a.d.e")).toBeUndefined();
        });

        it("getObjectProperty 数组测试", async () => {
            expect(getObjectProperty(target, "a.b.d.0.e")).toBe(10);
        });
    });
    /******************************** getObjectProperty end *******************************/
});
