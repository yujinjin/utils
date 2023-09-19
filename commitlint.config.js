/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-02-07 10:49:32
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-04-27 14:08:36
 * @项目的路径: \utils\commitlint.config.js
 * @描述: git commit 检查配置文件
 */
module.exports = {
    extends: ["@commitlint/config-conventional"],
    // rule配置说明：rule由name和配置数组组成，如：'name:[0, 'always', 72]'，数组中第一位为level，可选0,1,2，0为disable，1为warning，2为error，第二位为应用与否，可选always|never，第三位该rule的值。
    rules: {
        // scope的枚举值
        "scope-enum": [2, "always"],
        // 改变预设中的提交类型
        "type-enum": [2, "always", ["feat", "ui", "fix", "docs", "style", "refactor", "build", "ci", "perf", "chore", "revert", "test"]],
        // body 以空行开始
        "body-leading-blank": [1, "always"],
        // footer 是否以空行开始
        "footer-leading-blank": [1, "always"],
        // header内容的最大长度为72
        "header-max-length": [2, "always", 100],
        //
        "scope-case": [2, "always", "lower-case"],
        "subject-case": [1, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
        // subject内容不能为空
        "subject-empty": [2, "never"],
        // subject内容的最小长度为1
        "subject-full-stop": [2, "never", "."],
        // 提交类型必须使用小写
        "type-case": [2, "always", "lower-case"],
        // type不能为空
        "type-empty": [2, "never"]
    }
};
