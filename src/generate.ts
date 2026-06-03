/**
 * @创建者: yujinjin9@126.com
 * @创建时间: 2022-08-09 13:49:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\generate.ts
 * @描述: 动态生成数据
 */

/**
 * 生成符合 UUID v4 规范的32位随机标识符
 *
 * 生成格式为 `XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX` 的大写字符串，
 * 其中每位的重复概率为 1/(16^32)，几乎不可能重复。
 *
 * 实现逻辑：
 * 1. 使用模板字符串 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` 定义 UUID 格式
 * 2. 对每个 x/y 占位符生成4位随机16进制数：
 *    - x 位置：取 0-15 的随机数
 *    - y 位置：取 0-3 的随机数并设置高位为 1（8|9|A|B），符合 UUID v4 规范
 * 3. 将结果转为大写
 *
 * @returns 大写的 UUID v4 字符串，长度为36（含4个连字符）
 *
 * @example
 * guid() // => "A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D"
 * guid() // => "F7E6D5C4-B3A2-4987-6D5E-4C3B2A109876"
 */
export function guid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g, function (c) {
            /** 0-15 的随机数 */
            const r = (Math.random() * 16) | 0;
            /** 若 c 为 'x' 则取随机值，若 c 为 'y' 则确保高位为 1（符合 UUID v4 规范） */
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
        .toUpperCase();
}

/**
 * 生成基于日期的随机ID（年月日 + 8位随机16进制数）
 *
 * 生成格式为 `YYYYMMDDXXXXXXXX` 的字符串，其中：
 * - 前8位为当前日期（YYYYMMDD）
 * - 后8位为随机16进制数
 *
 * 实现逻辑：
 * 1. 生成8位随机16进制字符串（与 guid 同样的随机算法）
 * 2. 获取当前日期的年、月、日，不足两位前导补零
 * 3. 拼接日期和随机数
 *
 * @returns 16位随机ID字符串，格式为 YYYYMMDD + 8位随机16进制数
 *
 * @example
 * randomId() // => "20230603A1B2C3D4"
 * randomId() // => "20230603F7E6D5C4"
 */
export function randomId() {
    /** 当前日期对象 */
    const currentDate = new Date();
    /** 8位随机16进制字符串 */
    let randomId = "xxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
    // 拼接日期（年月日，不足两位补零）和随机数
    randomId =
        currentDate.getFullYear() +
        "" +
        (currentDate.getMonth() > 8 ? currentDate.getMonth() + 1 : "0" + (1 + currentDate.getMonth())) +
        "" +
        (currentDate.getDate() > 9 ? currentDate.getDate() : "0" + currentDate.getDate()) +
        randomId;
    return randomId;
}
