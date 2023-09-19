/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-04-27 15:14:36
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-09-19 10:35:41
 * @项目的路径: \utils\scripts\build.ts
 * @描述: 构建脚本
 */
import { rollup } from "rollup";
import rollupTypescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild, { minify as minifyPlugin } from "rollup-plugin-esbuild";
import { series } from "gulp";
import fastGlob from "fast-glob";
import fs from "fs-extra";
import { resolve } from "path";
import pkg from "./package.json";
import getPackageUpgradeVersion from "./utils/get-package-upgrade-version";
import console from "./utils/console";
import { PACEKAGE_NAME, BUILD_ROOT, SRC_ROOT } from "./utils/constants";

// dist目录
const DIST_ROOT = resolve(BUILD_ROOT, "dist");

// es目录
const ES_ROOT = resolve(BUILD_ROOT, "es");

// lib目录
const LIB_ROOT = resolve(BUILD_ROOT, "lib");

// types目录
const TYPES_ROOT = resolve(BUILD_ROOT, "types");

// 当前升级的版本号
let upgradeVersion = "";

// 引用第三方插件列表（让调用方提供对应依赖）
// const globals = {
//     dayjs: "dayjs",
// }

// 清空目录文件夹
const clear = async function () {
    console.info("清空“" + BUILD_ROOT + "”目录及该目录下所有文件");
    if (fs.pathExistsSync(BUILD_ROOT)) {
        await fs.remove(BUILD_ROOT);
    }
};

// 复制文件
const copy = async function () {
    console.info("复制“README.md”文件");
    // 复制README文件过去
    await fs.copy(resolve(__dirname, "..", "README.md"), resolve(BUILD_ROOT, "README.md"));
    console.info("复制“package.json”文件");
    // 复制package.json文件过去
    await fs.copy(resolve(__dirname, "package.json"), resolve(BUILD_ROOT, "package.json"));
};

// 变更本地package.json 版本号
const updatePackageVersion = async function () {
    // 获取 package.json 文件中的版本号
    // package.json路径
    const packageJsonPath = resolve(BUILD_ROOT, "package.json");
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    upgradeVersion = await getPackageUpgradeVersion(packageJson.name);
    packageJson.version = upgradeVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
};

const getInputs = async function () {
    return await fastGlob("**/*.ts", {
        cwd: SRC_ROOT,
        absolute: true,
        onlyFiles: true,
        ignore: ["node_modules", "__tests__/**/*"]
    });
};

// 单个组件打包 esm模块和cjs模块
const buildModules = async function () {
    console.info("单个组件打包 esm模块和cjs模块");
    const bundle = await rollup({
        input: await getInputs(),
        plugins: [
            rollupTypescript({
                allowSyntheticDefaultImports: true,
                resolveJsonModule: true
            }),
            nodeResolve({
                extensions: [".mjs", ".js", ".json", ".ts"]
            }),
            commonjs(),
            esbuild({
                sourceMap: true,
                target: "es2018"
            })
        ],
        // 如果你觉得第三方依赖体积很大，也可以用 external 拆出来，让调用方提供对应依赖，此时要配合 globals 一起用
        external: Object.keys(pkg.dependencies),
        treeshake: false
    });

    await Promise.all([
        bundle.write({
            format: "esm",
            dir: ES_ROOT,
            sourcemap: true,
            entryFileNames: "[name].mjs"
        }),
        bundle.write({
            format: "cjs",
            dir: LIB_ROOT,
            exports: "named",
            sourcemap: true,
            entryFileNames: "[name].js"
        })
    ]);
};

// 合并打包 esm模块和umd模块
const buildLib = async function (minify: boolean) {
    console.info("合并打包 esm模块和umd模块");
    // 编译后的JS横幅内容
    const banner = `/*! ${pkg.name} v${upgradeVersion} */\n`;
    // 插件
    const plugins = [
        rollupTypescript({
            allowSyntheticDefaultImports: true,
            resolveJsonModule: true
        }),
        nodeResolve({
            extensions: [".mjs", ".js", ".json", ".ts"]
        }),
        commonjs(),
        esbuild({
            exclude: [],
            sourceMap: minify,
            target: "es2018",
            define: {
                "process.env.NODE_ENV": JSON.stringify("production")
            },
            treeShaking: true,
            legalComments: "eof"
        })
    ];

    if (minify) {
        plugins.push(
            minifyPlugin({
                target: "es2018",
                sourceMap: true
            })
        );
    }

    const bundle = await rollup({
        input: resolve(__dirname, "..", "src/index.ts"),
        plugins,
        // 如果你觉得第三方依赖体积很大，也可以用 external 拆出来，让调用方提供对应依赖，此时要配合 globals 一起用
        external: Object.keys(pkg.dependencies),
        treeshake: false
    });

    await Promise.all([
        bundle.write({
            format: "umd",
            file: resolve(DIST_ROOT, `index.full${minify ? ".min" : ""}.js`),
            exports: "named",
            name: PACEKAGE_NAME,
            sourcemap: minify,
            banner
        }),
        bundle.write({
            format: "esm",
            file: resolve(DIST_ROOT, `index.full${minify ? ".min" : ""}.mjs`),
            sourcemap: minify,
            banner
        })
    ]);
};

// 合并打包 esm模块和umd模块
const buildLibs = async function () {
    await Promise.all([buildLib(false), buildLib(true)]);
};

// 生成对应的类型声明文件并放到types目录
const buildTypes = async function () {
    const bundle = await rollup({
        input: await getInputs(),
        plugins: [dts()]
    });

    await bundle.write({
        dir: TYPES_ROOT
    });
};

// 构建
export default series(clear, copy, updatePackageVersion, buildModules, buildLibs, buildTypes);
