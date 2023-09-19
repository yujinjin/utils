/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 10:18:12
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-03-29 18:57:14
 * @项目的路径: \CMS-components\packages\utils\url.ts
 * @描述: URL常用工具类方法
 */

/**
 *
 * @param url 当前要修改的URL
 * @param name 参数名，如果参数名(name)在URL中不存在有value值且可以增加就表示增加该参数
 * @param value 参数值，如果value为null或者空字符串就表示删除该参数
 * @param isAdd 如果没有该参数时是否可以增加该参数，默认为true.
 * @return 返回新的URL
 * 描述：修改url中的参数值，如果参数名(name)在URL中不存在且有value值就表示增加该参数，如果value为null或者空字符串就表示删除该参数
 */
export function changeUrlParameter(url: string, name: string, value?: string | number, isAdd = true): string {
    if (!url && !name) return "";
    const reg = new RegExp("(\\?|\\&)(" + name + "=)([^&#]*)(&|#)*", "gi");
    if (value === undefined || value === null) {
        // 删除参数
        return url.replace(reg, function (matchWord, parame1, parame2, parame3, parame4) {
            if (!parame4) {
                return "";
            }
            return parame4 === "#" ? parame4 : parame1;
        });
    }
    let hasName = false; // 是否有该参数
    let newUrl = url.replace(reg, function (matchWord, parame1, parame2, parame3, parame4) {
        hasName = true;
        return parame1 + parame2 + value + parame4;
    });
    if (!hasName && isAdd) {
        let symbolCharacter = "?";
        if (newUrl.indexOf("?") !== -1 && (newUrl.indexOf("#/") === -1 || newUrl.substring(newUrl.indexOf("#/")).indexOf("?") !== -1)) {
            // 兼容http://xxxx/?orderNo=xxx#/?id=xxx这种格式
            symbolCharacter = "&";
        }
        newUrl += symbolCharacter + name + "=" + value;
    }
    return newUrl;
}

/**
 *
 * @param url 需要解析的目标url
 * 描述：解析URL的参数、域名、协议、端口等对象
 */
export function parseUrl(url: string): Record<string, any> {
    const AElement = document.createElement("a");
    AElement.href = url;
    let search: string = AElement.search || "";
    if (!search) {
        //兼容http://xxxx/#/?id=xxx这种格式
        search = url.indexOf("?") === -1 ? "" : url.substring(url.indexOf("?"));
    } else if (url.indexOf("?") !== url.lastIndexOf("?")) {
        // 兼容http://xxxx/?orderNo=xxx#/?id=xxx这种格式
        search += (search.indexOf("?") === -1 ? "?" : "&") + url.substring(url.lastIndexOf("?") + 1);
    }
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
        protocol: AElement.protocol.replace(":", ""), //协议
        host: AElement.hostname, //域名
        port: AElement.port,
        // 参数未做decodeURIComponent处理
        query: search,
        params, //参数对象
        file: (AElement.pathname.match(/\/([^/?#]+)$/i) || ["", ""])[1],
        hash: (function () {
            if (!AElement.hash) {
                return "";
            } else if (AElement.hash.indexOf("?") === -1) {
                return AElement.hash.substring(1);
            }
            return AElement.hash.substring(1, AElement.hash.indexOf("?"));
        })(),
        path: AElement.pathname.replace(/^([^/])/, "/$1"),
        relative: (AElement.href.match(/tps?:\/\/[^/]+(.+)/) || ["", ""])[1],
        segments: AElement.pathname.replace(/^\//, "").split("/")
    };
}
