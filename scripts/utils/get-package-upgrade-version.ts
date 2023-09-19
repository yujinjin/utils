/*
 * @创建者: yujinjin9@126.com
 * @创建时间: 2023-09-19 09:40:49
 * @最后修改作者: yujinjin9@126.com
 * @最后修改时间: 2023-09-19 09:42:49
 * @项目的路径: \utils\scripts\get-package-upgrade-version.ts
 * @描述: 获取包升级的版本号
 */
import { exec } from "./process";

export default function (packageName) {
    console.info("获取最新包-" + packageName + "的版本号");
    // 当前项目线上最新版本号
    let latestVersion = "0.0.0";
    try {
        latestVersion = exec(`npm view ${packageName} version`);
    } catch (error) {
        console.info(packageName + "还未发布，现初始化为：" + latestVersion);
    }
    // 升级的版本类型，版本号、{major}.{minor}.{patch} => 主版本号.次版本号.修订号
    let updateVersionType = process.env.vt;
    let version = "";
    if (!updateVersionType) {
        // 如果没有传值，默认为patch 修订号升级
        updateVersionType = "patch";
    } else {
        updateVersionType = updateVersionType.trim();
    }
    if (/^\d+.\d+.\d+$/.test(updateVersionType)) {
        // 指定升级的版本号,判断当前的版本号是否合法
        if (updateVersionType === latestVersion || updateVersionType.split(".").findIndex((item, i) => parseInt(item, 10) < parseInt(latestVersion.split(".")[i], 10)) !== -1) {
            // 版本号不合法
            console.error(`指定的升级版本号-${updateVersionType}，比当前最新版本低`);
            throw new Error(`指定的升级版本号-${updateVersionType}，比当前最新版本低`);
        }
        version = updateVersionType;
    } else if (updateVersionType === "patch") {
        // 修订号升级
        version = latestVersion
            .split(".")
            .map((item, i) => (i === 2 ? parseInt(item, 10) + 1 : item))
            .join(".");
    } else if (updateVersionType === "minor") {
        // 次版本号升级
        version = latestVersion
            .split(".")
            .map((item, i) => (i === 1 ? parseInt(item, 10) + 1 : item))
            .join(".");
    } else if (updateVersionType === "major") {
        // 主版本号升级
        version = latestVersion
            .split(".")
            .map((item, i) => (i === 0 ? parseInt(item, 10) + 1 : item))
            .join(".");
    } else {
        console.error(`指定的升级版本(类型)-${updateVersionType}不合法，只能是版本号、‘major’、‘minor’、‘patch’`);
        throw new Error(`指定的升级版本(类型)-${updateVersionType}不合法，只能是版本号、‘major’、‘minor’、‘patch’`);
    }
    return version;
}
