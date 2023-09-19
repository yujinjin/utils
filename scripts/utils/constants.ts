/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-09-14 17:06:16
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-09-19 10:37:24
 * @项目的路径: \utils\scripts\utils\constants.ts
 * @描述: 构建常量
 */
import { resolve } from "path";

// 包名称
export const PACEKAGE_NAME = "utils";

// 项目根目录
export const PROJECT_ROOT = resolve(__dirname, "..", "..");

// 构建根目录
export const BUILD_ROOT = resolve(PROJECT_ROOT, "packages");

// src目录
export const SRC_ROOT = resolve(PROJECT_ROOT, "src");
