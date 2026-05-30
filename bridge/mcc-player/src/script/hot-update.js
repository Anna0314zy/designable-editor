/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const Axios = require("axios");
const fs = require("fs");
const request = require("request");
const AdmZip = require("adm-zip");
// const path = require('path');
const packageConfig = require("../../package.json");
const rawArgv = process.argv.slice(2);
const args = require("minimist")(rawArgv);
const env = args.mode || "test";
// const archiver = require('archiver');

const zipFilePath = "game.zip"; // 压缩包保存的本地路径
const extractDir = "common_game"; // 解压后的文件保存的目录
const renamedFileName = "cocos.html"; // 重命名后的文件名
const distDir = `dist/${packageConfig.version}`; // 文件移动的目标文件夹
// const buildDist = `buildDist/${packageConfig.version}`
const { baseUrl, COS_CDN_HOST } = require("./publish.config.json")[env];
const path = require('path');

let latestVersionUrl =
    "/classroom-slides/package-resources/latest-version/common/cocos-game-player";
const http = Axios.create({
      baseURL: baseUrl,
});
let version = '0.0.1'


getGameDownloadUrl(latestVersionUrl).then((downloadUrl) => {
  console.log("游戏资源包url, ", downloadUrl);
  // 下载压缩包
  request(downloadUrl)
    .pipe(fs.createWriteStream(zipFilePath))
    .on("close", function () {
      console.log("压缩包下载完成");

      // 解压缩文件
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(extractDir, true);
      console.log("压缩包解压完成", fs.readdirSync(extractDir));

      // 获取解压后的文件列表
      const extractedFiles = fs
        .readdirSync(extractDir)
        .filter((file) => file === "packageResources");

      console.log(extractedFiles, "extractedFiles");

      // 创建目标文件夹
      // 移动文件到目标文件夹
      extractedFiles.forEach((file) => {
        console.log(extractDir, file,'file====')
        // 移动文件到目标文件夹
        moveFiles(`${extractDir}/${file}/common/cocos-game-player/${version}/cocos-game-player`, distDir);
      });
      console.log("文件移动完成");

      // 删除解压后的文件夹
      deleteFolderRecursive(extractDir);

      // 删除压缩包
      fs.unlinkSync(zipFilePath);
      copyFiles("gameStatic", distDir);

      console.log("任务完成");


      // 递归移动文件夹中的所有文件和子文件夹
      function moveFiles(sourceDir, targetDir) {
        const files = fs.readdirSync(sourceDir);
        files.forEach((file) => {
          const sourcePath = `${sourceDir}/${file}`;
          const targetPath = `${targetDir}/${file}`;
          const fileStats = fs.statSync(sourcePath);

          if (fileStats.isFile()) {
            if (file === "index.html") {
              fs.renameSync(sourcePath, `${targetDir}/${renamedFileName}`);
            } else {
              fs.renameSync(sourcePath, targetPath);
            }
          } else if (fileStats.isDirectory()) {
            fs.mkdirSync(targetPath);
            moveFiles(sourcePath, targetPath);
          }
        });
      }

      function copyFiles(sourceDir, targetDir) {
        // 读取源文件夹的内容
        fs.readdir(sourceDir, (err, files) => {
          if (err) {
            console.error("Error reading source directory:", err);
            return;
          }

          // 遍历源文件夹中的每个文件
          files.forEach((file) => {
            const sourceFile = path.join(sourceDir, file);
            const targetFile = path.join(targetDir, file);

            // 判断文件的类型
            fs.stat(sourceFile, (err, stats) => {
              if (err) {
                console.error("Error getting file stats:", err);
                return;
              }

              if (stats.isFile()) {
                // 如果是文件，则将文件复制到目标文件夹
                fs.copyFile(sourceFile, targetFile, (err) => {
                  if (err) {
                    console.error("Error copying file:", err);
                  }
                });
              } else if (stats.isDirectory()) {
                // 如果是文件夹，则递归调用copyFiles方法复制文件夹中的内容
                fs.mkdir(targetFile, (err) => {
                  if (err) {
                    console.error("Error creating directory:", err);
                    return;
                  }

                  copyFiles(sourceFile, targetFile);
                });
              }
            });
          });
        });
      }
    });
});

// 递归删除文件夹及其内容
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        // 递归删除子文件夹
        deleteFolderRecursive(curPath);
      } else {
        // 删除文件
        fs.unlinkSync(curPath);
      }
    });
    // 删除空文件夹
    fs.rmdirSync(path);
    console.log("文件夹删除成功");
  } else {
    console.log("文件夹不存在");
  }
}


async function getGameDownloadUrl(url) {
  return new Promise((resolve, reject) => {
      // 设置请求的配置，包括URL和请求头部等
      const config = {
          method: "GET",
          baseUrl: baseUrl,
          url: url,
          headers: {
              "Content-Type": "application/json",
              // 如果需要的话，你可以在这里添加其他的请求头，比如认证令牌等
          },
      };
      // 发送POST请求
      http(config)
          .then(function (response) {
              console.log(response.data);
              // callback(response.data);
              let data = response.data;
              if (
                  data &&
                  data.code == "200" &&
                  data.data &&
                  data.data.version
              ) {
                let zipUrl = COS_CDN_HOST + data.data.zipOssPath
                version = data.data.version
                return resolve(zipUrl);
              }
              
          })
          .catch(function (error) {
              reject('获取版本失败', error)
          });
  });
}
