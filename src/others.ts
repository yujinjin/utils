/**
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\others.ts
 * @描述: 站点其他常用工具类方法
 */

/**
 * 页面动态加载 JS 文件
 *
 * 通过创建 <script> 标签动态加载外部 JS 文件，支持重复加载检测和超时处理。
 *
 * 实现逻辑：
 * 1. 若页面中已存在同 ID 的元素，视为已加载，直接返回 true
 * 2. 创建 <script> 标签，设置 src 和 id，追加到 document.body
 * 3. 设置 10 秒超时定时器，超时后 resolve(false)
 * 4. 监听 script.onload 事件，加载成功后清除超时定时器并 resolve(true)
 *
 * @param url - JS 文件的 URL 路径
 * @param id - script 标签的 ID，用于防止同一文件重复加载
 * @returns Promise<boolean>，加载成功返回 true，超时返回 false，已加载返回 true
 *
 * @example
 * const success = await loadScript("https://cdn.example.com/lib.js", "lib-script")
 * if (success) { /* 加载成功 *\/ }
 */
export function loadScript(url: string, id: string): Promise<boolean> {
    return new Promise(resolve => {
        // 如果该 ID 已经加载过，直接返回 true
        if (document.getElementById(id)) {
            resolve(true);
            return;
        }
        /** 动态创建的 script 元素 */
        const script: HTMLScriptElement = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        /** 超时定时器，10秒后视为加载失败 */
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
 * 函数节流
 *
 * 降低函数执行频率，在指定时间间隔内最多执行一次。
 * 适用于 scroll、resize 等高频事件的性能优化。
 *
 * 实现逻辑：
 * 1. **leading 模式**（默认开启）：在冷却期开始时立即执行函数
 * 2. **trailing 模式**（默认开启）：在冷却期结束后执行最后一次触发的函数
 * 3. 通过时间戳差值判断是否进入新的冷却期
 * 4. 冷却期内的调用通过 setTimeout 延迟到冷却期结束时执行
 *
 * @param fn - 要节流的函数
 * @param wait - 函数执行的最小间隔时间（毫秒）
 * @param options - 节流选项：
 *   - `leading` — 是否在冷却期开始时立即执行，默认 true
 *   - `trailing` — 是否在冷却期结束后执行最后一次调用，默认 true
 *   - 注意：leading 和 trailing 同为 false 没有实际意义
 * @returns 节流后的函数，与原函数具有相同的 this 上下文和参数
 *
 * @example
 * const throttledScroll = throttle(handleScroll, 250)
 * window.addEventListener('scroll', throttledScroll, false)
 *
 * // 仅在冷却期结束时执行（延迟执行）
 * const throttled = throttle(fn, 300, { leading: false, trailing: true })
 *
 * // 仅在冷却期开始时执行（立即执行，丢弃后续调用）
 * const throttled = throttle(fn, 300, { leading: true, trailing: false })
 */
export function throttle(fn: (...args: any[]) => any, wait: number, { leading, trailing } = { leading: true, trailing: true }) {
    /** 延迟执行的定时器 ID，null 表示无待执行的延迟调用 */
    let timeout: null | number = null;
    /** 上次执行函数的时间戳，0 表示尚未执行过 */
    let previous = 0;
    return function (this: any, ...args: any[]) {
        /** 当前时间戳 */
        const now = Date.now();
        // leading 为 false 时，将 previous 设为当前时间，使首次调用不立即执行
        if (leading === false) previous = now;
        /** 距离下次可执行时间的剩余毫秒数 */
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            // 已超过冷却期，立即执行
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            fn.apply(this, args);
        } else if (!timeout && trailing !== false) {
            // 在冷却期内且无待执行的延迟调用，设置 trailing 延迟执行
            timeout = window.setTimeout(() => {
                previous = leading === false ? 0 : Date.now();
                timeout = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

/**
 * 函数防抖
 *
 * 在连续触发结束后等待指定时间才执行函数。若在等待期间再次触发，则重新计时。
 * 适用于搜索框输入、窗口调整等场景，确保只在操作停止后执行。
 *
 * 实现逻辑：
 * 1. 每次调用时清除之前的定时器
 * 2. 设置新的定时器，等待 wait 毫秒后执行回调
 * 3. 只有最后一次调用（停止触发后 wait 毫秒）才会真正执行
 *
 * @param callback - 要防抖的函数
 * @param wait - 等待时间（毫秒），在最后一次触发后等待该时间再执行
 * @returns 防抖后的函数，与原函数具有相同的 this 上下文和参数
 *
 * @example
 * const debouncedSearch = debounce(searchAPI, 300)
 * input.addEventListener('input', debouncedSearch)
 */
export function debounce(callback: (...args: any[]) => any, wait: number) {
    /** 延迟执行的定时器 ID，null 表示无待执行调用 */
    let timeout: number | null = null;
    return function (this: any, ...args: any[]) {
        // 每次触发时清除之前的定时器，重新计时
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => {
            callback.apply(this, args);
        }, wait);
    };
}

/**
 * 数字转中文金额
 *
 * 将数字转换为中文大写或小写金额格式，支持整数和小数（最多两位）。
 *
 * 实现逻辑：
 * 1. 超过最大值（999999999999.99）时返回空字符串
 * 2. 将数字保留两位小数后分为整数部分和小数部分
 * 3. 整数部分：四位分级（个/万/亿），每级内按位转换（个/十/百/千），合并连续的零字
 * 4. 小数部分：第一位为"角"，第二位为"分"
 * 5. 整数部分后补"元"，无小数时补"整"
 *
 * @param number - 要转换的数字，支持 number 或 string 类型
 * @param type - 文本类型，"upper" 为大写（壹贰叁...），"lower" 为小写（一二三...），默认 "upper"
 * @returns 中文金额字符串，如 "壹亿元整"、"壹拾贰亿叁仟肆佰贰拾叁万肆仟贰佰壹拾壹元壹角贰分"。超过最大值返回空字符串
 *
 * @example
 * number2text(100000000)           // => "壹亿元整"
 * number2text("1234234211.12")     // => "壹拾贰亿叁仟肆佰贰拾叁万肆仟贰佰壹拾壹元壹角贰分"
 * number2text(100000000, "lower")  // => "一亿元整"
 */
export function number2text(number: string | number, type: "upper" | "lower" = "upper") {
    /** 中文数字配置，包含大写/小写数字、单位、级别和小数单位 */
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

    // 过滤不合法参数：超过最大值返回空字符串
    if (Number(number) > confs.maxNumber) {
        return "";
    }

    /** 当前类型（大写/小写）的配置 */
    const conf = confs[type];
    /** 将数字保留两位小数后按小数点拆分为 [整数部分, 小数部分] */
    const numbers = String(Number(number).toFixed(2)).split(".");
    /** 整数部分的各位数字字符数组 */
    const integer = numbers[0].split("");
    /** 小数部分的各位数字字符数组，无小数时为空数组 */
    const decimal = Number(numbers[1]) === 0 ? [] : numbers[1].split("");
    // 四位分级：将整数部分从低位到高位每4位分为一级
    const levels = integer.reverse().reduce((pre: Array<string[]>, item, idx) => {
        const level = pre[0] && pre[0].length < 4 ? pre[0] : [];
        /** 当前数字的数值索引 */
        const numIndex = Number(item);
        /** 当前位对应的中文值：零直接取数字字，非零取数字字+单位字 */
        const value = item === "0" ? conf.num[numIndex] : conf.num[numIndex] + conf.unit[idx % 4];
        level.unshift(value);

        if (level.length === 1) {
            pre.unshift(level);
        } else {
            pre[0] = level;
        }

        return pre;
    }, []);

    // 整数部分：将各级别合并，处理连续零字和末尾零字
    const _integer = levels.reduce((pre, item, idx) => {
        /** 当前级别对应的级别词（万/亿） */
        let _level = conf.level[levels.length - idx - 1];
        /** 当前级别内的中文数字字符串 */
        let _item = item.join("").replace(/(零)\1+/g, "$1"); // 连续多个零字合并为单个零字

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

    // 小数部分：第一位为角，第二位为分
    const _decimal = decimal
        .map((item, idx) => {
            const unit = confs.decimal.unit;
            /** 当前小数位对应的单位（分/角），为零则无单位 */
            const _unit = item !== "0" ? unit[unit.length - idx - 1] : "";

            return `${conf.num[Number(item)]}${_unit}`;
        })
        .join("");

    // 整数部分后补"元"，无小数时补"整"
    return `${_integer}元` + (_decimal || "整");
}

/**
 * 设置对象中指定属性路径上的值
 *
 * 沿属性路径逐层设置值，若路径中的属性不存在则自动创建：
 * - 缺少的索引属性（路径下一层为数字）创建为数组
 * - 缺少的命名属性创建为对象
 *
 * 实现逻辑：
 * 1. 验证参数：path 不能为空，object 必须为对象类型
 * 2. 将字符串路径标准化：`a[b].c` → `a.b.c`，去除前导点
 * 3. 若路径只有一层，直接赋值
 * 4. 多层路径：逐层获取或创建中间对象/数组，最后设置叶子节点的值
 *
 * @param object - 操作的目标数据对象
 * @param path - 属性路径，支持点分隔字符串（如 "a.b.c"）、方括号（如 "a[b].c"）或字符串数组（如 ["a", "b", "c"]）
 * @param value - 要设置的值
 * @returns 包含 rootObject 的对象，rootObject 为根属性名对应的值
 * @throws 当 path 为空时抛出 "path 属性路径上的值不能为空"
 * @throws 当 object 不是对象类型时抛出 "设置的目标必须是对象类型"
 * @throws 当 path 既不是字符串也不是数组时抛出 "path 属性路径只能为字符串类型或数组类型"
 *
 * @example
 * const obj = { a: { b: { c: 12 } } }
 * setObjectProperty(obj, "a.b.c", 11)       // obj.a.b.c === 11
 * setObjectProperty({}, "x.y.z", true)      // 自动创建中间对象
 * setObjectProperty([], "0.name", "test")   // 自动创建数组中的对象
 */
export function setObjectProperty(object: Record<string, any>, path: string | string[], value: any) {
    if (!path) {
        throw "path 属性路径上的值不能为空";
    } else if (!object || typeof object !== "object") {
        throw "设置的目标必须是对象类型";
    }
    /** 路径拆分后的属性名数组 */
    let keyArray: string[] = [];
    if (typeof path === "string") {
        // 将 a[b].c 转换为 a.b.c
        path = path.replace(/\[(\w+)\]/g, ".$1");
        // 去除前导点，将 .a.b 转换为 a.b
        path = path.replace(/^\./, "");
        keyArray = path.split(".");
    } else if (Array.isArray(path)) {
        keyArray = path;
    } else {
        throw "path 属性路径只能为字符串类型或数组类型";
    }
    // 单层路径：直接赋值
    if (keyArray.length === 1) {
        object[keyArray[0]] = value;
        return { rootObject: { [keyArray[0]]: value } };
    }
    /**
     * 获取或创建目标对象中指定 key 的值
     * 若值不存在或非对象类型，则根据 isArray 创建空数组或空对象
     * @param targetObject - 当前层级的对象
     * @param key - 属性名
     * @param isArray - 是否应创建为数组（下一层路径为数字索引时为 true）
     */
    const getValue = function (targetObject: Record<string, any>, key: string, isArray: boolean) {
        let value = targetObject[key];
        if (value === undefined || value === null || typeof value !== "object") {
            targetObject[key] = value = isArray ? [] : {};
        }
        return value;
    };

    /** 沿路径逐层获取的当前值 */
    let targetValue = getValue(object, keyArray[0], /^\d+$/.test(keyArray[1]));
    /** 根属性名，用于构建返回值 */
    const rootName = keyArray[0];
    /** 根属性的值引用 */
    const rootValue = targetValue;
    // 逐层遍历中间路径，获取或创建中间对象
    for (let i = 1; i < keyArray.length - 1; i++) {
        targetValue = getValue(targetValue, keyArray[i], /^\d+$/.test(keyArray[i + 1]));
    }
    // 设置叶子节点的值
    targetValue[keyArray[keyArray.length - 1]] = value;
    return { rootObject: { [rootName]: rootValue } };
}

/**
 * 根据属性路径获取对象中的值
 *
 * 沿属性路径逐层查找，返回叶子节点的值。若路径中任一层级不存在，
 * 则返回 defaultValue。
 *
 * 实现逻辑：
 * 1. 验证参数：path 不能为空，object 必须为对象类型
 * 2. 将字符串路径标准化：`a[b].c` → `a.b.c`，去除前导点
 * 3. 逐层沿路径查找，使用 hasOwnProperty 判断属性是否存在
 * 4. 若遇到 null 值直接返回 null（不使用 defaultValue）
 * 5. 若遇到 undefined 值返回 defaultValue
 *
 * @param object - 操作的目标数据对象
 * @param path - 属性路径，支持点分隔字符串（如 "a.b.c"）、方括号（如 "a[b].c"）或字符串数组（如 ["a", "b", "c"]）
 * @param defaultValue - 默认值，当解析到的值为 undefined 时返回此值
 * @returns 路径对应的值。路径不存在时返回 defaultValue，值为 null 时返回 null
 * @throws 当 path 为空时抛出 "path 属性路径上的值不能为空"
 * @throws 当 object 不是对象类型时抛出 "设置的目标必须是对象类型"
 * @throws 当 path 既不是字符串也不是数组时抛出 "path 属性路径只能为字符串类型或数组类型"
 *
 * @example
 * const obj = { a: { b: { c: 12, d: [{ e: 10 }] } } }
 * getObjectProperty(obj, "a.b.c")          // => 12
 * getObjectProperty(obj, "a.b.d.0.e")      // => 10
 * getObjectProperty(obj, "a.x.y", "none")  // => "none"（路径不存在，返回默认值）
 */
export function getObjectProperty(object: Record<string, any>, path: string | string[], defaultValue?: any) {
    if (!path) {
        throw "path 属性路径上的值不能为空";
    } else if (!object || typeof object !== "object") {
        throw "设置的目标必须是对象类型";
    }
    /** 路径拆分后的属性名数组 */
    let keyArray: string[] = [];
    if (typeof path === "string") {
        // 将 a[b].c 转换为 a.b.c
        path = path.replace(/\[(\w+)\]/g, ".$1");
        // 去除前导点，将 .a.b 转换为 a.b
        path = path.replace(/^\./, "");
        keyArray = path.split(".");
    } else if (path instanceof Array) {
        keyArray = path;
    } else {
        throw "path 属性路径只能为字符串类型或数组类型";
    }
    /** 沿路径逐层查找的当前值 */
    let targetValue: any = object;
    for (let i = 0; i < keyArray.length; i++) {
        if (Object.prototype.hasOwnProperty.call(targetValue, keyArray[i])) {
            targetValue = targetValue[keyArray[i]];
            // 值为 null 时直接返回 null，不使用 defaultValue
            if (targetValue === null) return null;
        } else {
            targetValue = undefined;
        }
        // 值为 undefined 时返回 defaultValue
        if (targetValue === undefined) {
            return defaultValue;
        }
    }
    return targetValue;
}
