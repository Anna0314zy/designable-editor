const fs = require('fs');
const path = require('path');
const packageConfig = require('../package.json')



// 使用示例
const sourceFolder = `dist/${packageConfig.version}`; // 源文件夹路径
const targetFolder = `../bridge/mcc-player/packageResources/common/slidePreview/1.0.0`; // 目标文件夹路径


// 异步递归复制函数
function copyFolderRecursiveAsync(source, target, callback) {
    fs.mkdir(target, { recursive: true }, (err) => {
        if (err) {
            return callback(err);
        }

        fs.readdir(source, { withFileTypes: true }, (err, files) => {
            if (err) {
                return callback(err);
            }

            let count = files.length;
            if (count === 0) callback();

            files.forEach((file) => {
                const sourcePath = path.join(source, file.name);
                const targetPath = path.join(target, file.name);

                if (file.isDirectory()) {
                    // 目录则递归复制
                    copyFolderRecursiveAsync(sourcePath, targetPath, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--count === 0) {
                            callback();
                        }
                    });
                } else {
                    // 文件则直接复制
                    fs.copyFile(sourcePath, targetPath, (err) => {
                        if (err) {
                            return callback(err);
                        }
                        if (--count === 0) {
                            callback();
                        }
                    });
                }
            });
        });
    });
}


copyFolderRecursiveAsync(sourceFolder, targetFolder, (err) => {
    if (err) {
        console.error('复制过程中发生错误:', err);
    } else {
        console.log('文件夹复制完成');
    }
});
