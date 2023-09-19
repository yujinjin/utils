/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-03-27 09:55:34
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-04-27 14:21:19
 * @项目的路径: \utils\vitest.config.ts
 * @描述: vitest 配置
 */
/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
    optimizeDeps: {
        disabled: true
    },
    test: {
        clearMocks: true
    }
});
