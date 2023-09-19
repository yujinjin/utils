/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-04-27 15:44:25
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-09-14 17:39:30
 * @项目的路径: \utils\scripts\process.ts
 * @描述: 命令处理
 */
import { spawn, execSync } from "child_process";
import console from "./console";
import { PROJECT_ROOT } from "./constants";

// 命令运行
export const run = function (command: string, cwd: string = PROJECT_ROOT) {
    return new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(" ");
        console.info(`run: ${cmd} ${args.join(" ")}`);
        const app = spawn(cmd, args, {
            cwd,
            stdio: "inherit",
            shell: process.platform === "win32"
        });

        const onProcessExit = () => {
            app.kill("SIGHUP");
        };

        let stdoutData = null;

        app.stdout?.on("data", data => {
            console.info(`stdout: ${data}`);
            stdoutData = data;
        });

        app.on("close", code => {
            process.removeListener("exit", onProcessExit);

            if (code === 0) {
                resolve(stdoutData);
            } else {
                console.error(`Command failed. \n Command: ${command} \n Code: ${code}`);
                reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`));
            }
        });
        process.on("exit", onProcessExit);
    });
};

// 命令执行
export const exec = function (command: string, cwd?: string) {
    console.info(`开始exec: ${command}`);
    const execResult = execSync(command, { cwd });
    console.success("执行结果:" + execResult.toString().trim());
    return execResult.toString().trim();
};
