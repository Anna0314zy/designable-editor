/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const archiver = require('archiver');
const packageConfig = require("../package.json");
const fs = require("fs");


// const buildDist = `buildDist/${packageConfig.version}`
const distDir = `dist/${packageConfig.version}`; 
const zipName = `zip/common_preview_${packageConfig.version}.zip`
fs.mkdirSync('zip', { recursive: true });
// 创建一个可写流，用于写入压缩包
const output = fs.createWriteStream(zipName);

// 创建一个 archiver 实例，指定压缩格式为 zip
const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别（可选）
});
// 将可写流与 archiver 实例关联
archive.pipe(output);

// 将 dist 文件夹添加到压缩包
archive.directory(distDir, false);

// 完成压缩操作
archive.finalize();

// 监听压缩完成事件
output.on('close', function () {
    console.log('压缩包创建完成');
});

// 监听错误事件
archive.on('error', function (error) {
    console.error('压缩过程中出错:', error);
});

// fs.mkdirSync(buildDist, { recursive: true });