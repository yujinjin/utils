/**
 * @创建者: yujinjin9@126.com
 * @创建时间: 2021-12-30
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\format.ts
 * @描述: 站点常用格式化方法
 */

/**
 * 日期格式化
 *
 * 将日期对象、时间戳或日期字符串按照指定格式进行格式化输出。
 * 支持的格式占位符：
 * - `YYYY` / `yyyy` — 四位年份
 * - `MM` / `M+` — 月份（1-12），MM 补零
 * - `DD` / `dd` / `D+` / `d+` — 日期（1-31），DD 补零
 * - `HH` / `H+` — 24小时制小时（0-23），HH 补零
 * - `hh` / `h+` — 12小时制小时（0-11），hh 补零
 * - `mm` / `m+` — 分钟（0-59），mm 补零
 * - `ss` / `s+` — 秒（0-59），ss 补零
 * - `SSS` / `S+` — 毫秒（0-999），SSS 衡零
 * - `q+` — 季度（1-4）
 *
 * 实现逻辑：
 * 1. 若 date 非 Date 实例，则通过 new Date() 转换
 * 2. 构建日期各部分的配置映射表 dateConfig
 * 3. 遍历配置表的每个 key（正则模式），若 format 中匹配该模式，则替换为对应值
 * 4. 当格式占位符长度大于值的位数时，前导补零
 *
 * @param date - 要格式化的日期，支持 Date 对象、时间戳(number)或日期字符串(string)
 * @param format - 格式化模板字符串，默认为 "YYYY-MM-DD"
 * @returns 格式化后的日期字符串
 *
 * @example
 * dateFormat(new Date(1679986245414))                          // => "2023-03-28"
 * dateFormat(1679986245414, "YYYY-MM-DD HH:mm:ss.SSS")        // => "2023-03-28 14:50:45.414"
 * dateFormat("2023-01-01", "YYYY年MM月DD日")                   // => "2023年01月01日"
 */
export function dateFormat(date: Date | number | string, format = "YYYY-MM-DD"): string {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    /** 日期各部分的配置映射表，key 为正则模式，value 为对应的数值 */
    const dateConfig: Record<string, number> = {
        "(Y|y)+": (<Date>date).getFullYear(), // 年份
        "M+": (<Date>date).getMonth() + 1, // 月份（1-12）
        "(d|D)+": (<Date>date).getDate(), // 日期（1-31）
        "h+": (<Date>date).getHours() > 12 ? (<Date>date).getHours() - 12 : (<Date>date).getHours(), // 12小时制小时
        "H+": (<Date>date).getHours(), // 24小时制小时
        "m+": (<Date>date).getMinutes(), // 分钟
        "s+": (<Date>date).getSeconds(), // 秒
        "q+": Math.floor(((<Date>date).getMonth() + 3) / 3), // 季度（1-4）
        "S+": (<Date>date).getMilliseconds() // 毫秒
    };
    Object.keys(dateConfig).forEach(key => {
        if (new RegExp(key).test(format)) {
            format = format.replace(new RegExp("(" + key + ")"), function (match) {
                // 当格式占位符长度大于数值位数时，前导补零
                if (match.length > String(dateConfig[key]).length) {
                    return new Array(match.length - String(dateConfig[key]).length).fill("0").join("") + String(dateConfig[key]);
                }
                return String(dateConfig[key]);
            });
        }
    });
    return format;
}

/**
 * 日期时间段显示格式化
 *
 * 计算给定日期与当前时间的差值，返回人性化的时间描述：
 * - 60秒以内 → "刚刚之前"
 * - 1小时以内 → "X分钟前"
 * - 24小时以内 → "X小时前"
 * - 30天以内 → "X天前"
 * - 30天以上且同一年 → "MM/DD"（月/日）
 * - 30天以上且跨年 → "YYYY/MM/DD"（年/月/日）
 *
 * @param date - 要比较的日期，支持 Date 对象、时间戳(number)或日期字符串(string)
 * @param separator - 日期格式的分隔符，默认为 "/"
 * @returns 人性化的时间差描述字符串
 *
 * @example
 * // 假设当前时间为 2023-03-28 15:00:00
 * timeDifferenceFormat(new Date("2023-03-28 14:59:00"))  // => "刚刚之前"
 * timeDifferenceFormat(new Date("2023-03-28 14:50:00"))  // => "10分钟前"
 * timeDifferenceFormat(new Date("2023-03-20"))           // => "8天前"
 */
export function timeDifferenceFormat(date: Date | number | string, separator = "/") {
    /** 当前时间 */
    const currentTime = new Date();
    /** 待比较的时间 */
    const compareTime = new Date(date);
    /** 当前时间与比较时间的差值（秒） */
    const timeDifference = (currentTime.getTime() - compareTime.getTime()) / 1000;
    if (timeDifference < 60) {
        return "刚刚之前";
    } else if (timeDifference < 3600) {
        return parseInt(String(timeDifference / 60), 10) + "分钟前";
    } else if (timeDifference < 60 * 60 * 24) {
        return parseInt(String(timeDifference / 3600), 10) + "小时前";
    } else if (timeDifference < 60 * 60 * 24 * 30) {
        return parseInt(String(timeDifference / (60 * 60 * 24)), 10) + "天前";
    } else if (compareTime.getFullYear() === currentTime.getFullYear()) {
        return dateFormat(compareTime, `MM${separator}DD`);
    }
    return dateFormat(compareTime, `YYYY${separator}MM${separator}DD`);
}

/**
 * 将数值格式化为千分位分隔的字符串，并按指定小数位四舍五入
 *
 * 实现逻辑：
 * 1. 若 value 为字符串，先去除 $ 和逗号，再转为浮点数
 * 2. digit 小于 0 时修正为 0，大于 11 时抛出错误
 * 3. 使用 toFixed 进行四舍五入
 * 4. 对整数部分添加千分位逗号分隔
 *
 * @param value - 要格式化的数值，支持数字或数字字符串（可含逗号和$符号）
 * @param digit - 保留小数点后几位，默认为 0。取值范围 0-11，超出 11 会抛错
 * @returns 格式化后的字符串，如 "1,234,567.45"
 * @throws {Error} 当 digit > 11 时，抛出 "最大支持11位小数格式化" 错误
 *
 * @example
 * numberFormat(1234567.55)        // => "1,234,568"
 * numberFormat(200, 2)            // => "200.00"
 * numberFormat("1,234.56", 2)     // => "1,234.56"
 * numberFormat(100, 12)           // => throws Error
 */
export function numberFormat(value: number | string, digit = 0): string {
    if (typeof value === "string") {
        value = (<string>value).replace(/\$|,/g, "");
        value = parseFloat(value);
    }
    if (digit < 0) {
        digit = 0;
    } else if (digit > 11) {
        throw new Error("最大支持11位小数格式化");
    }
    value = value.toFixed(digit);
    if (value.indexOf(".") === -1) {
        // 整数：对整数部分添加千分位逗号
        value = value.replace(/\B(?=(?:\d{3})+$)/g, ",");
    } else {
        // 小数：分别对整数部分添加千分位逗号，小数部分保持不变
        value = value.substring(0, value.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ",") + value.substring(value.indexOf("."), value.length);
    }
    return <string>value;
}

/**
 * 字符串内容格式化
 *
 * 将字符串中的占位符替换为对应的参数值，支持两种占位符格式：
 * - 数字索引占位符：`{0}`, `{1}`, ... — 配合数组参数使用
 * - 命名占位符：`{name}`, `{age}`, ... — 配合对象参数使用
 *
 * 实现逻辑：
 * 1. 若 parameters 为空或 contents 为空，直接返回 contents
 * 2. 若 parameters 为数组（length > 0），按索引依次替换 `{0}`, `{1}`, ...
 * 3. 若 parameters 为对象，按 key 依次替换 `{key}`
 * 4. 参数值为 null 时替换为空字符串
 *
 * @param contents - 模板字符串，包含占位符如 `{0}` 或 `{name}`
 * @param parameters - 替换参数，支持数组或对象。为数组时按索引替换，为对象时按 key 替换
 * @returns 替换后的字符串。若 parameters 为空则返回原字符串
 *
 * @example
 * stringFormat("我是{0}，今年{1}岁了", ["jack", 12])       // => "我是jack，今年12岁了"
 * stringFormat("我是{name}，今年{age}岁了", { name: "jack", age: 5 }) // => "我是jack，今年5岁了"
 * stringFormat("hello")                                     // => "hello"
 */
export function stringFormat(contents: string, parameters?: Array<string | boolean | number> | Record<string, any>): string {
    if (!parameters || !contents) {
        return contents;
    }
    if (parameters.length > 0) {
        // 数组参数：按索引替换 {0}, {1}, ...
        (<Array<any>>parameters).forEach((value, index) => {
            contents = contents.replace(new RegExp("\\{" + index + "\\}", "g"), value === null ? "" : value);
        });
    } else {
        // 对象参数：按 key 替换 {name}, {age}, ...
        Object.keys(parameters).forEach(key => {
            contents = contents.replace(new RegExp("\\{" + key + "\\}", "g"), (<Record<string, any>>parameters)[key] === null ? "" : (<Record<string, any>>parameters)[key]);
        });
    }
    return contents;
}
