/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-02-08 18:06:57
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-08-14 18:32:01
 * @项目的路径: \utils\.eslintrc.js
 * @描述: eslingt 配置
 */

const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest"
    },
    plugins: ["@typescript-eslint", "prettier"],
    extends: ["eslint:recommended", "plugin:import/recommended", "plugin:eslint-comments/recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    settings: {
        "import/resolver": {
            node: { extensions: [".js", ".mjs", ".ts", ".d.ts", ".tsx"] }
        }
    },
    overrides: [
        {
            files: ["**/__tests__/**", "scripts/**/*"],
            rules: {
                "no-console": "off",
                "no-debugger": "off",
                "no-empty": "off",
                "no-return-await": "off"
            }
        },
        {
            files: ["*.d.ts"],
            rules: {}
        },
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-var-requires": "off"
            }
        }
    ],
    rules: {
        // 允许调用 console 对象的方法
        "no-console": "error",
        // 是否使用 debugger
        "no-debugger": "error",
        // 禁止在循环中 出现 await
        "no-await-in-loop": "error",
        // 禁用不必要的 return await function()
        "no-return-await": "error",
        // 不允许使用 var
        "no-var": "error",
        // 生产模式禁止出现空语句块
        "no-empty": "error",
        // 禁止重复导入(imports)
        // "no-duplicate-imports": "error",
        // 禁用 tab
        "no-tabs": "error",
        // 要求使用 === 和 !==
        "eqeqeq": ["error", "always"],
        // 禁用 Alert、prompt 和 confirm
        "no-alert": "error",
        // 警告：在 else 前有 return（如果 if 块中包含了一个 return 语句，else 块就成了多余的了。可以将其内容移至块外。）
        "no-else-return": "warn",
        // 禁用 eval()
        "no-eval": "error",
        // 禁用 eval()
        "no-implied-eval": "error",
        // 禁用不必要的嵌套块
        "no-lone-blocks": "error",
        // 禁用一成不变的循环条件
        "no-unmodified-loop-condition": "error",
        "no-unused-vars": "off",
        // 强制在 parseInt() 使用基数参数
        "radix": "error",
        // 禁止在变量定义之前使用它们
        "no-use-before-define": "error",
        // 强制使用骆驼拼写法命名约定
        "camelcase": ["error", { properties: "always" }],
        // 强制块语句的最大可嵌套深度
        "max-depth": ["error", 4],
        // 要求或禁止末尾逗号
        "comma-dangle": "error",
        // (默认) 要求尽可能地使用双引号
        "quotes": ["error", "double"],
        // 如果有属性名称要求使用引号，则所有的属性名称都要使用引号；否则，禁止所有的属性名称使用引号
        "quote-props": ["error", "consistent-as-needed"],
        // 针对匿名函数表达式必须空格 (比如 function () {})|针对命名的函数表达式禁止空格 (比如 function foo() {})|针对异步的箭头函数表达式必须空格 (比如 async () => {})。
        "space-before-function-paren": ["error", { anonymous: "always", named: "never", asyncArrow: "always" }],
        // ts
        // 函数与类方法的返回值可以依赖类型推导
        "@typescript-eslint/explicit-module-boundary-types": "off",
        // 允许显式的 any的使用
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        // 允许非空断言与可选链同时使用：foo?.bar!
        "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
        // 约束使用 import type {} 进行类型的导入
        "@typescript-eslint/consistent-type-imports": ["error", { disallowTypeAnnotations: false }],
        "@typescript-eslint/ban-ts-comment": ["off", { "ts-ignore": false }],
        // "@typescript-eslint/quotes": ["error", "double"]
        "import/named": "off"
    }
});
