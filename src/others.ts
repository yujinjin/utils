/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-09-18 17:10:07
 * @项目的路径: \utils\src\others.ts
 * @描述: 站点其他常用工具类方法
 */

/**
 * @param url JS文件的路径
 * @param id 当前加载js文件标签的ID，防止同一个文件重复加载
 * @param callback JS文件加载成功或失败后的回调函数
 * 描述：页面动态加载JS文件，如果超过10S文件还未加载表示超时
 */
export function loadScript(url: string, id: string): Promise<boolean> {
    return new Promise(resolve => {
        //如果URL不存在或者该ID已经加载过了
        if (document.getElementById(id)) {
            resolve(true);
            return;
        }
        const script: HTMLScriptElement = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        //默认10S超时就立即执行回调函数
        let timer: number | null = window.setTimeout(function () {
            timer = null;
            resolve(false);
        }, 10000);
        script.onload = function () {
            if (timer) {
                clearTimeout(timer);
                resolve(true);
            }
        };
        script.src = url;
        document.body.appendChild(script);
    });
}

/**
 * 函数节流，提升性能,用于操作函数节流，节流就间隔时间段 时间内执行一次，也就是降低频率，将高频操作优化成低频操作。
 * @param {function} func 要执行的函数（不能是匿名函数）
 * @param {number} wait 函数执行的最小间隔
 * @param {object} options {leading: true,trailing: true}, leading: 是否立即执行，tailing: 是否在冷却后执行;
 * @example let cb=app.utils.throttle(fnName,250); window.addEventListener('scroll', cb, false);
 * 注意：leading和tailing同为false没有意义了
 */
export function throttle(fn: (...args: any[]) => any, wait: number, { leading, trailing } = { leading: true, trailing: true }) {
    let timeout: null | number = null;
    let previous = 0;
    return function (this: any, ...args: any[]) {
        const now = Date.now();
        if (leading === false) previous = now;
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            fn.apply(this, args);
        } else if (!timeout && trailing !== false) {
            timeout = window.setTimeout(() => {
                previous = leading === false ? 0 : Date.now();
                timeout = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

/**
 *
 * 函数防抖
 * @param callback 执行的函数
 * @param wait 等待的时间
 * @returns Function
 */
export function debounce(callback, wait) {
    let timeout;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            callback.apply(this, args);
        }, wait);
    };
}

/**
 * 数字转中文数码(TODO: 待优化)
 *
 * @param {Number|String}   num     数字[正整数]
 * @param {String}          type    文本类型，lower|upper，默认upper
 *
 * @example number2text(100000000) => "壹亿元整"
 */
export function number2text(number: string | number, type: "upper" | "lower" = "upper") {
    // 配置
    const confs = {
        lower: {
            num: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
            unit: ["", "十", "百", "千", "万"],
            level: ["", "万", "亿"]
        },
        upper: {
            num: ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"],
            unit: ["", "拾", "佰", "仟"],
            level: ["", "万", "亿"]
        },
        decimal: {
            unit: ["分", "角"]
        },
        maxNumber: 999999999999.99
    };

    // 过滤不合法参数
    if (Number(number) > confs.maxNumber) {
        // console.error(`The maxNumber is ${confs.maxNumber}. ${number} is bigger than it!`);
        return "";
    }

    const conf = confs[type];
    const numbers = String(Number(number).toFixed(2)).split(".");
    const integer = numbers[0].split("");
    const decimal = Number(numbers[1]) === 0 ? [] : numbers[1].split("");

    // 四位分级
    const levels = integer.reverse().reduce((pre: Array<string[]>, item, idx) => {
        const level = pre[0] && pre[0].length < 4 ? pre[0] : [];
        const value = item === "0" ? conf.num[item] : conf.num[item] + conf.unit[idx % 4];
        level.unshift(value);

        if (level.length === 1) {
            pre.unshift(level);
        } else {
            pre[0] = level;
        }

        return pre;
    }, []);

    // 整数部分
    const _integer = levels.reduce((pre, item, idx) => {
        let _level = conf.level[levels.length - idx - 1];
        let _item = item.join("").replace(/(零)\1+/g, "$1"); // 连续多个零字的部分设置为单个零字

        // 如果这一级只有一个零字，则去掉这级
        if (_item === "零") {
            _item = "";
            _level = "";

            // 否则如果末尾为零字，则去掉这个零字
        } else if (_item[_item.length - 1] === "零") {
            _item = _item.slice(0, _item.length - 1);
        }

        return pre + _item + _level;
    }, "");

    // 小数部分
    const _decimal = decimal
        .map((item, idx) => {
            const unit = confs.decimal.unit;
            const _unit = item !== "0" ? unit[unit.length - idx - 1] : "";

            return `${conf.num[item]}${_unit}`;
        })
        .join("");

    // 如果是整数，则补个整字
    return `${_integer}元` + (_decimal || "整");
}

/**
 * 设置 object对象中对应 path 属性路径上的值，如果path不存在，则创建。 缺少的索引属性会创建为数组，而缺少的属性会创建为对象。
 * @param object 操作的数据对象
 * @param path path 属性路径
 * @param value 设置的值
 */
export function setObjectProperty(object: Record<string, any>, path: string | string[], value) {
    if (!path) {
        throw "path 属性路径上的值不能为空";
    } else if (!object || typeof object !== "object") {
        throw "设置的目标必须是对象类型";
    }
    let keyArray: string[] = [];
    if (typeof path === "string") {
        //将a[b].c转换为a.b.c
        path = path.replace(/\[(\w+)\]/g, ".$1");
        path = path.replace(/^\./, "");
        //将.a.b转换为a.b
        keyArray = path.split(".");
    } else if (Array.isArray(path)) {
        keyArray = path;
    } else {
        throw "path 属性路径只能为字符串类型或数组类型";
    }
    if (keyArray.length === 1) {
        object[keyArray[0]] = value;
        return { rootObject: { [keyArray[0]]: value } };
    }
    const getValue = function (targetObject, key, isArray) {
        let value = targetObject[key];
        if (value === undefined || value === null || typeof value !== "object") {
            targetObject[key] = value = isArray ? [] : {};
        }
        return value;
    };

    let targetValue = getValue(object, keyArray[0], /^\d+$/.test(keyArray[1]));
    const rootName = keyArray[0];
    const rootValue = targetValue;
    for (let i = 1; i < keyArray.length - 1; i++) {
        targetValue = getValue(targetValue, keyArray[i], /^\d+$/.test(keyArray[i + 1]));
    }
    targetValue[keyArray[keyArray.length - 1]] = value;
    return { rootObject: { [rootName]: rootValue } };
}

/**
 * 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
 * @param object 操作的数据对象
 * @param path 属性路径
 * @param defaultValue 默认值，如果解析 value 是 undefined 返回 defaultValue
 */
export function getObjectProperty(object: Record<string, any>, path: string | string[], defaultValue?) {
    if (!path) {
        throw "path 属性路径上的值不能为空";
    } else if (!object || typeof object !== "object") {
        throw "设置的目标必须是对象类型";
    }
    let keyArray: string[] = [];
    if (typeof path === "string") {
        //将a[b].c转换为a.b.c
        path = path.replace(/\[(\w+)\]/g, ".$1");
        path = path.replace(/^\./, "");
        //将.a.b转换为a.b
        keyArray = path.split(".");
    } else if (path instanceof Array) {
        keyArray = path;
    } else {
        throw "path 属性路径只能为字符串类型或数组类型";
    }
    let targetValue: any = object;
    for (let i = 0; i < keyArray.length; i++) {
        if (Object.prototype.hasOwnProperty.call(targetValue, keyArray[i])) {
            targetValue = targetValue[keyArray[i]];
            if (targetValue === null) return null;
        } else {
            targetValue = undefined;
        }
        if (targetValue === undefined) {
            return defaultValue;
        }
    }
    return targetValue;
}
