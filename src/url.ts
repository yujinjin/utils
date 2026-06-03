/**
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 10:18:12
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\url.ts
 * @描述: URL常用工具类方法
 */

/**
 * 修改 URL 中的查询参数
 *
 * 根据参数名对 URL 的查询字符串进行增、改、删操作：
 * - **添加参数**：当参数名不存在且 value 有值且 isAdd 为 true 时，添加该参数
 * - **修改参数**：当参数名已存在且 value 有值时，更新该参数值
 * - **删除参数**：当 value 为 undefined 或 null 时，移除该参数
 *
 * 实现逻辑：
 * 1. 使用正则匹配 URL 中目标参数的位置
 * 2. 若 value 为 undefined/null，执行删除操作（移除参数名和值）
 * 3. 若 value 有值，替换匹配到的参数值
 * 4. 若参数不存在且 isAdd 为 true，在 URL 末尾追加参数
 * 5. 兼容 `http://xxx/?orderNo=xxx#/?id=xxx` 这种 hash 路由中含参数的格式
 *
 * @param url - 原始 URL 字符串
 * @param name - 要操作的参数名
 * @param value - 要设置的参数值。为 undefined/null 时表示删除该参数。支持 string 或 number 类型
 * @param isAdd - 当参数名不存在时是否允许添加，默认为 true。设为 false 时，若参数不存在则不添加
 * @returns 修改后的新 URL 字符串
 *
 * @example
 * changeUrlParameter("https://example.com", "name", "test")              // => "https://example.com?name=test"
 * changeUrlParameter("https://example.com?name=1", "name", "test")       // => "https://example.com?name=test"
 * changeUrlParameter("https://example.com?name=1", "name")               // => "https://example.com"
 * changeUrlParameter("https://example.com", "name", "test", false)       // => "https://example.com"
 */
export function changeUrlParameter(url: string, name: string, value?: string | number, isAdd = true): string {
    if (!url && !name) return "";
    /** 匹配 URL 中目标参数的正则，捕获分组：parame1(问号或&), parame2(参数名=), parame3(参数值), parame4(&或#) */
    const reg = new RegExp("(\\?|\\&)(" + name + "=)([^&#]*)(&|#)*", "gi");
    if (value === undefined || value === null) {
        // 删除参数：移除匹配到的参数名=值，保留正确的分隔符
        return url.replace(reg, function (matchWord, parame1, parame2, parame3, parame4) {
            if (!parame4) {
                return "";
            }
            return parame4 === "#" ? parame4 : parame1;
        });
    }
    /** 标记 URL 中是否已存在该参数 */
    let hasName = false;
    let newUrl = url.replace(reg, function (matchWord, parame1, parame2, parame3, parame4) {
        hasName = true;
        return parame1 + parame2 + value + parame4;
    });
    // 参数不存在时，根据 isAdd 决定是否追加
    if (!hasName && isAdd) {
        /** URL 中参数与值之间的连接符，已存在 ? 时用 &，否则用 ? */
        let symbolCharacter = "?";
        if (newUrl.indexOf("?") !== -1 && (newUrl.indexOf("#/") === -1 || newUrl.substring(newUrl.indexOf("#/")).indexOf("?") !== -1)) {
            // 兼容 http://xxxx/?orderNo=xxx#/?id=xxx 这种格式
            symbolCharacter = "&";
        }
        newUrl += symbolCharacter + name + "=" + value;
    }
    return newUrl;
}

/**
 * 解析 URL 的各个组成部分
 *
 * 将 URL 字符串解析为包含协议、域名、端口、参数、路径等信息的对象。
 *
 * 实现逻辑：
 * 1. 利用 DOM 的 `<a>` 元素自动解析 URL 的各部分
 * 2. 提取查询字符串，兼容 hash 路由中含参数的格式（如 `?a=1#/?b=2`）
 * 3. 将查询字符串解析为参数对象（对值进行 decodeURIComponent 解码）
 * 4. 提取文件名、hash、路径、相对路径、路径分段等信息
 *
 * @param url - 需要解析的 URL 字符串
 * @returns 解析结果对象，包含以下字段：
 *   - `sources` — 原始 URL 字符串
 *   - `protocol` — 协议（如 "https"）
 *   - `host` — 域名（如 "example.com"）
 *   - `port` — 端口号（如 "9090"，默认端口为空）
 *   - `query` — 查询字符串（含 ?，如 "?name=test&age=5"）
 *   - `params` — 查询参数对象（值已 decodeURIComponent 解码）
 *   - `file` — 文件名（如 "index.html"）
 *   - `hash` — hash 路径（不含 # 和查询参数）
 *   - `path` — 路径（如 "/test/index.html"）
 *   - `relative` — 相对路径（含查询字符串和 hash）
 *   - `segments` — 路径分段数组（如 ["test", "index.html"]）
 *
 * @example
 * parseUrl("https://example.com:9090/test?name=hello")
 * // => { protocol: "https", host: "example.com", port: "9090", params: { name: "hello" }, ... }
 */
export function parseUrl(url: string): Record<string, any> {
    /** 利用 <a> 元素自动解析 URL 各部分 */
    const AElement = document.createElement("a");
    AElement.href = url;
    /** 查询字符串（含 ? 前缀） */
    let search: string = AElement.search || "";
    if (!search) {
        // 兼容 http://xxxx/#/?id=xxx 这种 hash 路由中含参数的格式
        search = url.indexOf("?") === -1 ? "" : url.substring(url.indexOf("?"));
    } else if (url.indexOf("?") !== url.lastIndexOf("?")) {
        // 兼容 http://xxxx/?orderNo=xxx#/?id=xxx 这种格式，合并两段查询参数
        search += (search.indexOf("?") === -1 ? "?" : "&") + url.substring(url.lastIndexOf("?") + 1);
    }
    /** 查询参数对象，key 为参数名，value 为解码后的参数值 */
    const params: Record<string, any> = {};
    search
        .replace(/^\?/, "")
        .split("&")
        .forEach(param => {
            if (!param) {
                return;
            }
            const paramsString: string[] = param.split("=");
            params[paramsString[0]] = decodeURIComponent(paramsString[1] || "");
        });
    return {
        sources: url,
        protocol: AElement.protocol.replace(":", ""), // 协议（去除冒号）
        host: AElement.hostname, // 域名
        port: AElement.port, // 端口
        // 参数未做 decodeURIComponent 处理
        query: search, // 原始查询字符串
        params, // 解码后的参数对象
        file: (AElement.pathname.match(/\/([^/?#]+)$/i) || ["", ""])[1], // 文件名
        hash: (function () {
            if (!AElement.hash) {
                return "";
            } else if (AElement.hash.indexOf("?") === -1) {
                return AElement.hash.substring(1);
            }
            // hash 中含参数时，只取 hash 路径部分
            return AElement.hash.substring(1, AElement.hash.indexOf("?"));
        })(),
        path: AElement.pathname.replace(/^([^/])/, "/$1"), // 路径（确保以 / 开头）
        relative: (AElement.href.match(/tps?:\/\/[^/]+(.+)/) || ["", ""])[1], // 相对路径
        segments: AElement.pathname.replace(/^\//, "").split("/") // 路径分段数组
    };
}
