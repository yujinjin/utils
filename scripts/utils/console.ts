/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-09-14 14:42:39
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-09-14 15:59:11
 * @项目的路径: \utils\scripts\console.ts
 * @描述: 控制台打印
 */
import chalk from "chalk";

export default {
    info: function (message, ...args) {
        console.info(`\n${chalk.bgBlueBright.black(" INFO ")} ${chalk.blueBright(message)}`, ...args);
    },
    success: function (message, ...args) {
        console.info(`\n${chalk.bgGreenBright.black(" SUCCESS ")} ${chalk.greenBright(message)}`, ...args);
    },
    error: function (message, ...args) {
        console.error(`\n${chalk.bgHex("#FF0006").black(" ERROR ")} ${chalk.hex("#FF0006")(message)}`, ...args);
    },
    warn: function (message, ...args) {
        console.warn(`\n${chalk.bgHex("#BBBB23").black(" WARN ")} ${chalk.hex("#BBBB23")(message)}`, ...args);
    },
    debug: function (message, ...args) {
        console.debug(`\n${chalk.bgHex("#0D8F61").black(" DEBUG ")} ${chalk.hex("#0D8F61")(message)}`, ...args);
    }
};
