/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 14:45:39
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\__tests__\format.test.ts
 * @描述: 格式化方法测试用例
 */
import { describe, expect, test, vi } from "vitest";
import { dateFormat, timeDifferenceFormat, numberFormat, stringFormat } from "../index";

describe("utils format", () => {
    /******************************** dateFormat start *******************************/
    describe("dateFormat testing", () => {
        const date = new Date(1679986245414);
        test("日期格式化(yyyy-MM-dd)", () => {
            expect(dateFormat(date)).toBe("2023-03-28");
        });
        test("日期格式化(YYYY-MM-DD HH:mm:ss.SSS)", () => {
            expect(dateFormat(date, "YYYY-MM-DD HH:mm:ss.SSS")).toBe("2023-03-28 14:50:45.414");
        });

        // 传入时间戳
        test("日期格式化 - 传入时间戳(number)", () => {
            expect(dateFormat(1679986245414, "YYYY-MM-DD")).toBe("2023-03-28");
        });

        // 传入时间字符串
        test("日期格式化 - 传入时间字符串", () => {
            expect(dateFormat("2023-03-28", "YYYY-MM-DD")).toBe("2023-03-28");
        });

        // 小写格式（dateFormat 中 m+ 匹配分钟，小写 y 匹配年份但 m 匹配分钟而非月份）
        test("日期格式化 - 小写yyyy-mm-dd（mm匹配分钟而非月份）", () => {
            // 注意：dateFormat 中 "m+" 匹配的是分钟，不是月份，"M+" 才是月份
            expect(dateFormat(date, "yyyy-mm-dd")).toBe("2023-50-28");
        });

        // 仅年份
        test("日期格式化 - 仅年份 YYYY", () => {
            expect(dateFormat(date, "YYYY")).toBe("2023");
        });

        // 仅月份
        test("日期格式化 - 仅月份 MM", () => {
            expect(dateFormat(date, "MM")).toBe("03");
        });

        // 12小时制
        test("日期格式化 - 12小时制 hh:mm:ss", () => {
            expect(dateFormat(date, "hh:mm:ss")).toBe("02:50:45");
        });

        // 24小时制
        test("日期格式化 - 24小时制 HH:mm:ss", () => {
            expect(dateFormat(date, "HH:mm:ss")).toBe("14:50:45");
        });

        // 季度（q+ 中的 + 号不被消费，会保留在输出中）
        test("日期格式化 - 季度 q+", () => {
            expect(dateFormat(date, "q+")).toBe("1+");
        });

        // 毫秒（S+ 中的 + 号不被消费，会保留在输出中）
        test("日期格式化 - 毫秒 S+", () => {
            expect(dateFormat(date, "S+")).toBe("414+");
        });

        // 边界：午夜零点
        test("日期格式化 - 午夜零点", () => {
            const midnight = new Date(2023, 0, 1, 0, 0, 0, 0);
            expect(dateFormat(midnight, "YYYY-MM-DD HH:mm:ss")).toBe("2023-01-01 00:00:00");
        });

        // 边界：年末
        test("日期格式化 - 年末", () => {
            const endOfYear = new Date(2023, 11, 31, 23, 59, 59, 999);
            expect(dateFormat(endOfYear, "YYYY-MM-DD HH:mm:ss.SSS")).toBe("2023-12-31 23:59:59.999");
        });
    });
    /******************************** dateFormat end *******************************/

    /******************************** timeDifferenceFormat start *******************************/
    describe("timeDifferenceFormat testing", () => {
        const times = 1679986245414;
        const date = new Date(times);

        test("日期时间段显示格式化(60秒内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 20 * 1000)).toBe("刚刚之前");
            vi.useRealTimers();
        });
        test("日期时间段显示格式化(60分钟内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 9 * 60 * 1000 - 1)).toBe("9分钟前");
            vi.useRealTimers();
        });
        test("日期时间段显示格式化(24小时内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 5 * 60 * 60 * 1000 - 1)).toBe("5小时前");
            vi.useRealTimers();
        });
        test("日期时间段显示格式化(30天内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 3 * 24 * 60 * 60 * 1000 - 1)).toBe("3天前");
            vi.useRealTimers();
        });
        test("日期时间段显示格式化(同一年)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 40 * 24 * 60 * 60 * 1000 - 1)).toBe("02/16");
            vi.useRealTimers();
        });
        test("日期时间段显示格式化(不在同一年内)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 200 * 24 * 60 * 60 * 1000 - 1, "-")).toBe("2022-09-09");
            vi.useRealTimers();
        });

        // 边界：刚好60秒
        test("日期时间段显示格式化(刚好60秒)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 60 * 1000)).toBe("1分钟前");
            vi.useRealTimers();
        });

        // 边界：刚好1小时
        test("日期时间段显示格式化(刚好1小时)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 3600 * 1000)).toBe("1小时前");
            vi.useRealTimers();
        });

        // 边界：刚好24小时
        test("日期时间段显示格式化(刚好24小时)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 24 * 3600 * 1000)).toBe("1天前");
            vi.useRealTimers();
        });

        // 边界：0秒前（同一时刻）
        test("日期时间段显示格式化(同一时刻)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times)).toBe("刚刚之前");
            vi.useRealTimers();
        });

        // 自定义分隔符
        test("日期时间段显示格式化(自定义分隔符)", () => {
            vi.useFakeTimers();
            vi.setSystemTime(date);
            expect(timeDifferenceFormat(times - 40 * 24 * 60 * 60 * 1000 - 1, "-")).toBe("02-16");
            vi.useRealTimers();
        });
    });
    /******************************** timeDifferenceFormat end *******************************/

    /******************************** numberFormat start *******************************/
    describe("numberFormat testing", () => {
        test("数值格式化2位小数(200)", () => {
            expect(numberFormat(200, 2)).toBe("200.00");
        });
        test("数值格式化整数(1234567.45)", () => {
            expect(numberFormat(1234567.55)).toBe("1,234,568");
        });

        // 传入字符串
        test("数值格式化 - 传入字符串", () => {
            expect(numberFormat("1234567.45", 2)).toBe("1,234,567.45");
        });

        // 传入带逗号的字符串
        test("数值格式化 - 传入带逗号的字符串", () => {
            expect(numberFormat("1,234,567.45", 2)).toBe("1,234,567.45");
        });

        // 边界：0
        test("数值格式化 - 0", () => {
            expect(numberFormat(0)).toBe("0");
        });

        // 边界：负数digit自动修正为0
        test("数值格式化 - 负数digit修正为0", () => {
            expect(numberFormat(123.456, -1)).toBe("123");
        });

        // 边界：超过11位小数抛错
        test("数值格式化 - digit超过11位抛错", () => {
            expect(() => numberFormat(100, 12)).toThrow("最大支持11位小数格式化");
        });

        // 大数
        test("数值格式化 - 大数千分位", () => {
            expect(numberFormat(1234567890, 0)).toBe("1,234,567,890");
        });

        // 小数
        test("数值格式化 - 小数1位", () => {
            expect(numberFormat(1234.5, 1)).toBe("1,234.5");
        });

        // 四舍五入
        test("数值格式化 - 四舍五入", () => {
            expect(numberFormat(1234.567, 2)).toBe("1,234.57");
        });

        // 边界：1位数字
        test("数值格式化 - 1位数字", () => {
            expect(numberFormat(1, 0)).toBe("1");
        });

        // 边界：2位数字
        test("数值格式化 - 2位数字", () => {
            expect(numberFormat(12, 0)).toBe("12");
        });

        // 边界：3位数字（不需要逗号）
        test("数值格式化 - 3位数字", () => {
            expect(numberFormat(123, 0)).toBe("123");
        });

        // 边界：4位数字（需要逗号）
        test("数值格式化 - 4位数字", () => {
            expect(numberFormat(1234, 0)).toBe("1,234");
        });

        // 传入带$符号的字符串
        test("数值格式化 - 传入带$符号的字符串", () => {
            expect(numberFormat("$1,234.56", 2)).toBe("1,234.56");
        });
    });
    /******************************** numberFormat end *******************************/

    /******************************** stringFormat start *******************************/
    describe("stringFormat testing", () => {
        test("字符串格式化(我是{0}，今年{1}岁了)", () => {
            expect(stringFormat("我是{0}，今年{1}岁了", ["jack yu", 12])).toBe("我是jack yu，今年12岁了");
        });
        test("字符串格式化(我是{name}，今年{age}岁了)", () => {
            expect(stringFormat("我是{name}，今年{age}岁了", { name: "jack yu", age: 5 })).toBe("我是jack yu，今年5岁了");
        });

        // 边界：空字符串
        test("字符串格式化 - 空字符串", () => {
            expect(stringFormat("", ["a"])).toBe("");
        });

        // 边界：parameters 为 undefined
        test("字符串格式化 - parameters为undefined", () => {
            expect(stringFormat("hello {0}")).toBe("hello {0}");
        });

        // 边界：parameters 为 null
        test("字符串格式化 - parameters为null", () => {
            expect(stringFormat("hello {0}", null as any)).toBe("hello {0}");
        });

        // 边界：空数组参数
        test("字符串格式化 - 空数组参数", () => {
            expect(stringFormat("hello", [])).toBe("hello");
        });

        // 边界：空对象参数
        test("字符串格式化 - 空对象参数", () => {
            expect(stringFormat("hello", {})).toBe("hello");
        });

        // null 值替换为空字符串
        test("字符串格式化 - null值替换为空字符串(数组)", () => {
            expect(stringFormat("值是{0}", [null as any])).toBe("值是");
        });

        // null 值替换为空字符串（对象）
        test("字符串格式化 - null值替换为空字符串(对象)", () => {
            expect(stringFormat("值是{name}", { name: null as any })).toBe("值是");
        });

        // 多个相同占位符
        test("字符串格式化 - 多个相同占位符", () => {
            expect(stringFormat("{0}和{0}", ["我"])).toBe("我和我");
        });

        // boolean 值
        test("字符串格式化 - boolean值", () => {
            expect(stringFormat("结果是{0}", [true])).toBe("结果是true");
        });

        // 不匹配的占位符保持原样
        test("字符串格式化 - 不匹配的占位符保持原样", () => {
            expect(stringFormat("我是{0}，今年{1}岁了", ["jack yu"])).toBe("我是jack yu，今年{1}岁了");
        });
    });
    /******************************** stringFormat end *******************************/
});
