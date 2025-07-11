/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-28 15:34:35
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2024-05-20 09:47:20
 * @项目的路径: \utils\src\__tests__\generate.test.ts
 * @描述: 动态生成数据测试用例
 */
import { describe, expect, test } from "vitest";
import { guid, randomId } from "../index";

describe("utils generate", () => {
    test("guid 随机生成100个，检查重复性", () => {
        const guidArray = new Array(100).fill("").map(() => guid());
        expect(new Set(guidArray).size === guidArray.length).toBeTruthy();
    });

    test("randomId 随机生成100个，检查重复性", () => {
        const randomIdArray = new Array(100).fill("").map(() => randomId());
        expect(new Set(randomIdArray).size === randomIdArray.length).toBeTruthy();
    });
});
