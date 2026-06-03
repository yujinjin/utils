/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-29 17:33:50
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2026-06-03
 * @项目的路径: \utils\src\__tests__\url.test.ts
 * @描述: URL测试用例
 */
// @vitest-environment jsdom
import { describe, expect, test } from "vitest";
import { changeUrlParameter, parseUrl } from "../index";

describe("utils url", () => {
    /******************************** changeUrlParameter start *******************************/
    describe("changeUrlParameter testing", () => {
        test("url 添加参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com", "name", "test")).toBe("https://wwww.baidu.com?name=test");
        });

        test("url 修改参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com?name=1&sex=2", "name", "test")).toBe("https://wwww.baidu.com?name=test&sex=2");
        });

        test("url 参数不变", () => {
            expect(changeUrlParameter("https://wwww.baidu.com?sex=2", "name", "test", false)).toBe("https://wwww.baidu.com?sex=2");
        });

        test("url 删除参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com?name=1&sex=2", "name")).toBe("https://wwww.baidu.com?sex=2");
        });

        test("复杂url 添加参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com/?orderNo=ON001#/home?sex=x", "name", "test")).toBe("https://wwww.baidu.com/?orderNo=ON001#/home?sex=x&name=test");
        });

        test("复杂url 修改参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com/?orderNo=ON001&name=1#/home?sex=x", "name", "test")).toBe("https://wwww.baidu.com/?orderNo=ON001&name=test#/home?sex=x");
        });

        test("复杂url 删除参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com/?orderNo=ON001&name=1#/home?sex=x", "name")).toBe("https://wwww.baidu.com/?orderNo=ON001#/home?sex=x");
        });

        test("复杂url 删除参数2", () => {
            expect(changeUrlParameter("https://wwww.baidu.com/?name=1&orderNo=ON001#/home?sex=x", "name")).toBe("https://wwww.baidu.com/?orderNo=ON001#/home?sex=x");
        });

        // 边界：url和name都为空
        test("url url和name都为空返回空字符串", () => {
            expect(changeUrlParameter("", "")).toBe("");
        });

        // 边界：删除不存在的参数
        test("url 删除不存在的参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com?name=1", "notexist")).toBe("https://wwww.baidu.com?name=1");
        });

        // 边界：修改不存在的参数且isAdd为true时添加
        test("url 修改不存在的参数且isAdd为true时添加", () => {
            expect(changeUrlParameter("https://wwww.baidu.com", "name", "test", true)).toBe("https://wwww.baidu.com?name=test");
        });

        // 边界：修改不存在的参数且isAdd为false时不添加
        test("url 修改不存在的参数且isAdd为false时不添加", () => {
            expect(changeUrlParameter("https://wwww.baidu.com", "name", "test", false)).toBe("https://wwww.baidu.com");
        });

        // 边界：value为null时删除参数
        test("url value为null时删除参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com?name=1&sex=2", "name", null as any)).toBe("https://wwww.baidu.com?sex=2");
        });

        // 边界：value为数字
        test("url value为数字", () => {
            expect(changeUrlParameter("https://wwww.baidu.com", "count", 10)).toBe("https://wwww.baidu.com?count=10");
        });

        // 边界：URL无参数时添加第一个参数
        test("url 无参数时添加第一个参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com", "id", "123")).toBe("https://wwww.baidu.com?id=123");
        });

        // 边界：URL已有参数时添加第二个参数
        test("url 已有参数时添加第二个参数", () => {
            expect(changeUrlParameter("https://wwww.baidu.com?id=1", "name", "test")).toBe("https://wwww.baidu.com?id=1&name=test");
        });

        // 边界：删除唯一参数后无问号
        test("url 删除唯一参数后无问号", () => {
            expect(changeUrlParameter("https://wwww.baidu.com?name=1", "name")).toBe("https://wwww.baidu.com");
        });
    });
    /******************************** changeUrlParameter end *******************************/

    /******************************** parseUrl start *******************************/
    describe("parseUrl testing", () => {
        test("普通url解析带中文", () => {
            const parse = {
                sources: "https://wwww.baidu.com:9090/test/index.html?name=%E6%B5%8B%E8%AF%95&orderNo=ON001&sex=x",
                protocol: "https",
                host: "wwww.baidu.com",
                port: "9090",
                query: "?name=%E6%B5%8B%E8%AF%95&orderNo=ON001&sex=x",
                params: {
                    name: "测试",
                    orderNo: "ON001",
                    sex: "x"
                },
                file: "index.html",
                hash: "",
                path: "/test/index.html",
                relative: "/test/index.html?name=%E6%B5%8B%E8%AF%95&orderNo=ON001&sex=x",
                segments: ["test", "index.html"]
            };
            expect(parseUrl("https://wwww.baidu.com:9090/test/index.html?name=%E6%B5%8B%E8%AF%95&orderNo=ON001&sex=x")).toEqual(parse);
        });
        test("url解析带hash", () => {
            const parse = {
                sources: "https://wwww.baidu.com:9090/test/index.html?sex=x&name=%E6%B5%8B%E8%AF%95&orderNo=ON001",
                protocol: "https",
                host: "wwww.baidu.com",
                port: "9090",
                query: "?sex=x&name=%E6%B5%8B%E8%AF%95&orderNo=ON001",
                params: {
                    name: "测试",
                    orderNo: "ON001",
                    sex: "x"
                },
                file: "index.html",
                hash: "",
                path: "/test/index.html",
                relative: "/test/index.html?sex=x&name=%E6%B5%8B%E8%AF%95&orderNo=ON001",
                segments: ["test", "index.html"]
            };
            expect(parseUrl("https://wwww.baidu.com:9090/test/index.html?sex=x&name=%E6%B5%8B%E8%AF%95&orderNo=ON001")).toEqual(parse);
        });
        test("url解析hash前有参数", () => {
            const parse = {
                sources: "https://wwww.baidu.com:9090/test/index.html?name=%E6%B5%8B%E8%AF%95&orderNo=ON001#/home?sex=x",
                protocol: "https",
                host: "wwww.baidu.com",
                port: "9090",
                query: "?name=%E6%B5%8B%E8%AF%95&orderNo=ON001&sex=x",
                params: {
                    name: "测试",
                    orderNo: "ON001",
                    sex: "x"
                },
                file: "index.html",
                hash: "/home",
                path: "/test/index.html",
                relative: "/test/index.html?name=%E6%B5%8B%E8%AF%95&orderNo=ON001#/home?sex=x",
                segments: ["test", "index.html"]
            };
            expect(parseUrl("https://wwww.baidu.com:9090/test/index.html?name=%E6%B5%8B%E8%AF%95&orderNo=ON001#/home?sex=x")).toEqual(parse);
        });

        // 边界：无参数的URL
        test("url解析 - 无参数的URL", () => {
            const result = parseUrl("https://wwww.baidu.com/test/index.html");
            expect(result.protocol).toBe("https");
            expect(result.host).toBe("wwww.baidu.com");
            expect(result.params).toEqual({});
        });

        // 边界：默认端口
        test("url解析 - 默认端口(https为空)", () => {
            const result = parseUrl("https://wwww.baidu.com/test");
            expect(result.protocol).toBe("https");
            expect(result.port).toBe("");
        });

        // 边界：协议为http
        test("url解析 - http协议", () => {
            const result = parseUrl("http://wwww.baidu.com/test");
            expect(result.protocol).toBe("http");
        });

        // 边界：路径解析
        test("url解析 - 路径segments", () => {
            const result = parseUrl("https://wwww.baidu.com/api/v1/users");
            expect(result.segments).toEqual(["api", "v1", "users"]);
            expect(result.path).toBe("/api/v1/users");
        });

        // 边界：文件名解析
        test("url解析 - 文件名", () => {
            const result = parseUrl("https://wwww.baidu.com/test/page.html");
            expect(result.file).toBe("page.html");
        });

        // 边界：参数值含特殊字符
        test("url解析 - 参数值含特殊字符", () => {
            const result = parseUrl("https://wwww.baidu.com?key=hello%20world");
            expect(result.params.key).toBe("hello world");
        });
    });
    /******************************** parseUrl end *******************************/
});
