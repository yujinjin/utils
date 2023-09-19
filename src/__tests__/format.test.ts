/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 14:45:39
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-03-28 15:46:30
 * @项目的路径: \CMS-components\packages\utils\__tests__\format.test.ts
 * @描述: 格式化方法测试用例
 */
import { describe, expect, it, vi } from "vitest";
import { dateFormat, timeDifferenceFormat, numberFormat, stringFormat } from "../index";

describe("utils format", () => {
    /******************************** dateFormat start *******************************/
    describe("dateFormat testing", () => {
        const date = new Date(1679986245414);
        it("日期格式化(yyyy-MM-dd)", () => {
            expect(dateFormat(date)).toBe("2023-03-28");
        });
        it("日期格式化(YYYY-MM-DD HH:mm:ss.SSS)", () => {
            expect(dateFormat(date, "YYYY-MM-DD HH:mm:ss.SSS")).toBe("2023-03-28 14:50:45.414");
        });
    });
    /******************************** dateFormat end *******************************/

    /******************************** timeDifferenceFormat start *******************************/
    describe("timeDifferenceFormat testing", () => {
        const times = 1679986245414;
        const date = new Date(times);

        it("日期时间段显示格式化(60秒内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 20 * 1000)).toBe("刚刚之前");
            vi.useRealTimers();
        });
        it("日期时间段显示格式化(60分钟内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 9 * 60 * 1000 - 1)).toBe("9分钟前");
            vi.useRealTimers();
        });
        it("日期时间段显示格式化(24小时内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 5 * 60 * 60 * 1000 - 1)).toBe("5小时前");
            vi.useRealTimers();
        });
        it("日期时间段显示格式化(30天内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 3 * 24 * 60 * 60 * 1000 - 1)).toBe("3天前");
            vi.useRealTimers();
        });
        it("日期时间段显示格式化(同一年)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 40 * 24 * 60 * 60 * 1000 - 1)).toBe("02/16");
            vi.useRealTimers();
        });
        it("日期时间段显示格式化(不在同一年内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 200 * 24 * 60 * 60 * 1000 - 1, "-")).toBe("2022-09-09");
            vi.useRealTimers();
        });
    });
    /******************************** timeDifferenceFormat end *******************************/

    /******************************** numberFormat start *******************************/
    describe("numberFormat testing", () => {
        it("数值格式化2位小数(200)", () => {
            expect(numberFormat(200, 2)).toBe("200.00");
        });
        it("数值格式化整数(1234567.45)", () => {
            expect(numberFormat(1234567.55)).toBe("1,234,568");
        });
    });
    /******************************** numberFormat end *******************************/

    /******************************** stringFormat start *******************************/
    describe("stringFormat testing", () => {
        it("字符串格式化(我是{0}，今年{1}岁了)", () => {
            expect(stringFormat("我是{0}，今年{1}岁了", ["jack yu", 12])).toBe("我是jack yu，今年12岁了");
        });
        it("字符串格式化(我是{name}，今年{age}岁了)", () => {
            expect(stringFormat("我是{name}，今年{age}岁了", { name: "jack yu", age: 5 })).toBe("我是jack yu，今年5岁了");
        });
    });
    /******************************** stringFormat end *******************************/
});
