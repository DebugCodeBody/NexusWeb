const fs = require("fs");
const {
    log,
    done,
    info,
    error,
    logWithSpinner,
    stopSpinner
} = require('@vue/cli-shared-utils');

const fsExtra = require("fs-extra");
const path = require("path");


function getAppName(name) {
    const match = name.match(/(.*?)UI/)

    return match && match.length == 2 && match[1].toLocaleLowerCase();
}


function resolve(pathStr) {
    return path.resolve(__dirname, pathStr);
}


function readAppJson() {
    try {
        return JSON.parse(fs.readFileSync(resolve("../app.json"), "utf-8"))
    } catch (err) {
        error("app.json文件读取失败，请确认文件是否存在");
        error(err);
    }
}

function copyDist(compilation) {

    let distPath = "";
    if (compilation) {
        distPath = compilation.outputOptions.path;
    } else {
        distPath = resolve("../dist");
    }

    try {

        const app = readAppJson();
        if (!app) {
            return;
        }

        info("开始复制文件到服务端应用目录");


        let appPath;

        if (app.path) {
            appPath = app.path;
        } else {
            appPath = app.name.replace(/\./g, "/");
        }

        appPath = path.join(app.server, appPath);
        if (!fs.existsSync(appPath)) {
            return error(`目录不存在:${appPath}`);
        }


        info(`应用名称：${app.name}`);
        info(`应用目录：${appPath}`);

        const publicPath = path.join(appPath, "public")

        fsExtra.emptyDirSync(publicPath)

        fsExtra.copySync(distPath, publicPath);
        info("完成辣");

    } catch (err) {
        error("复制静态文件出错");
        error(err);
    }
}


function getApiPath() {

    const app = readAppJson();

    let appPath;

    if (app.path) {
        appPath = app.path;
    } else {
        appPath = app.name.replace(/\./g, "/");
    }

    return appPath;

}

module.exports = {
    copyDist,
    getApiPath
};

if (process.argv[2] == "run") {
    copyDist();
}


