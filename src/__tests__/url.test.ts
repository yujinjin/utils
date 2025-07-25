/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-29 17:33:50
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-05-20 09:49:33
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
    });
    /******************************** parseUrl end *******************************/
});
