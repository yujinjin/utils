/**
 * @创建者: yujinjin9@126.com
 * @创建时间: 2020-08-13
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\extend.ts
 * @描述: 对象深复制、创建对象和继承（类似 jQuery.extend）
 */

/**
 * 判断值是否为函数类型
 *
 * @param value - 待检测的值，类型为 unknown 以支持任意输入
 * @returns 类型守卫，当 value 为函数时返回 true，否则返回 false
 *
 * @example
 * isFunction(() => {}) // => true
 * isFunction(123)      // => false
 * isFunction(null)     // => false
 */
function isFunction(value: unknown): value is (...args: any[]) => any {
    return typeof value === "function";
}

/**
 * 判断值是否为纯对象（通过 {} 或 new Object() 创建的普通对象）
 *
 * 排除以下非纯对象类型：
 * - Date、RegExp、Array 等内置对象
 * - DOM 节点、window 等宿主对象
 * - Object.create(null) 创建的无原型对象（视为纯对象）
 *
 * 实现逻辑：
 * 1. 先通过 typeof 排除非对象和 null
 * 2. 再通过 Object.prototype.toString.call 判断内部 [[Class]] 是否为 "[object Object]"
 * 3. 最后检查原型链：构造函数应为 Object 本身（或原型为 null 的无原型对象）
 *
 * @param value - 待检测的值，类型为 unknown 以支持任意输入
 * @returns 类型守卫，当 value 为纯对象时返回 true，否则返回 false
 *
 * @example
 * isPlainObject({})                  // => true
 * isPlainObject(new Date())          // => false
 * isPlainObject([])                  // => false
 * isPlainObject(Object.create(null)) // => true
 */
function isPlainObject(value: unknown): value is Record<string, any> {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    // Object.prototype.toString.call 是最可靠的方式判断纯对象
    if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
    }
    // 检查原型链：纯对象的构造函数原型应为 Object.prototype 或 null
    const proto = Object.getPrototypeOf(value);
    if (proto === null) {
        return true;
    }
    // 沿原型链查找，最终应到达 Object.prototype
    const ctor = proto.constructor;
    return typeof ctor === "function" && ctor === Object;
}

/**
 * 对象深复制/浅复制，创建对象和继承（类似 jQuery.extend）
 *
 * 将一个或多个源对象的属性合并到目标对象中。支持浅复制和深复制两种模式：
 * - **浅复制**：源对象的属性直接覆盖到目标对象，嵌套对象会被整体替换
 * - **深复制**：遇到纯对象或数组时递归合并，而非直接覆盖
 *
 * 实现逻辑：
 * 1. 解析参数：第一个参数为 boolean 时表示深复制标志，后续为 target 和 sources
 * 2. target 不是对象或函数时，自动转为空对象 {}
 * 3. 遍历每个 source 对象，跳过 null/undefined
 * 4. 对 source 的每个自有属性：
 *    - 若 target === copy（循环引用），跳过该属性
 *    - 深复制模式下，若 copy 为纯对象/数组，递归合并
 *    - 浅复制模式或非对象值，直接赋值（undefined 值不写入 target）
 *
 * @param args - 动态参数列表：
 *   - `extend(target, ...sources)` — 浅复制合并
 *   - `extend(deep, target, ...sources)` — 深复制合并，deep 为 boolean
 * @returns 合并后的目标对象（与传入的 target 为同一引用）
 *
 * @example
 * // 浅复制：嵌套对象整体替换
 * extend({ a: { x: 1 } }, { a: { y: 2 } }) // => { a: { y: 2 } }
 *
 * // 深复制：嵌套对象递归合并
 * extend(true, { a: { x: 1 } }, { a: { y: 2 } }) // => { a: { x: 1, y: 2 } }
 *
 * // 数组深复制
 * extend(true, [1, 2], [3, 4]) // => [3, 4]
 *
 * // 多个 source 依次合并
 * extend({}, { a: 1 }, { b: 2 }) // => { a: 1, b: 2 }
 */
export function extend(...args: any[]): Record<string, any> {
    /** 目标对象，所有源对象的属性将合并到此对象上 */
    let target: Record<string, any> = args[0] || {};
    /** 是否启用深复制模式 */
    let deep = false;
    /** 当前遍历的源对象在 args 中的起始索引 */
    let index = 1;

    // 第一个参数为 boolean 时表示深复制标志
    if (typeof target === "boolean") {
        deep = target;
        target = args[index] || {};
        index++;
    }

    // target 不是对象或函数时，自动转为空对象
    if (typeof target !== "object" && !isFunction(target)) {
        target = {};
    }

    // 只传入一个参数时，target 即为自身，调整 index 以跳过空遍历
    if (index === args.length) {
        index--;
    }

    for (; index < args.length; index++) {
        /** 当前正在遍历的源对象 */
        const source = args[index];
        // 跳过 null/undefined 的 source
        if (source === null || source === undefined) {
            continue;
        }

        for (const name in source) {
            // 仅处理 source 的自有属性，跳过继承属性
            if (!Object.prototype.hasOwnProperty.call(source, name)) {
                continue;
            }

            /** target 中对应属性的当前值 */
            const src = (target as Record<string, any>)[name];
            /** source 中对应属性的值（即将复制/合并的值） */
            const copy = (source as Record<string, any>)[name];

            // 防止循环引用：当 copy 与 target 为同一引用时跳过
            if (target === copy) {
                continue;
            }

            // 深复制模式：当 copy 为纯对象或数组时，递归合并
            if (deep && copy && (isPlainObject(copy) || Array.isArray(copy))) {
                /** 递归合并时的克隆对象：优先复用 target 中已有的同类型值，否则创建新的空对象/空数组 */
                let clone: Record<string, any>;
                if (Array.isArray(copy)) {
                    clone = src && Array.isArray(src) ? src : [];
                } else {
                    clone = src && isPlainObject(src) ? src : {};
                }
                (target as Record<string, any>)[name] = extend(deep, clone, copy);
            } else if (copy !== undefined) {
                // 浅复制模式，或深复制模式下非对象/数组的值：直接赋值
                // 注意：值为 undefined 的属性不写入 target（与 jQuery.extend 行为一致）
                (target as Record<string, any>)[name] = copy;
            }
        }
    }

    return target;
}
