/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const COS = require('cos-nodejs-sdk-v5')
const https = require("https");
const cosConfig = require('./cos.config.json')
const fs = require('fs')
const path = require('path')
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv)
const env = args.mode || 'test'
const { prefix, COS_CDN_HOST, COS_BUCKET } = require('./publish.config.json')[env]

const packageConfig = require('../package.json')
const cosInstance = new COS({
    SecretId: cosConfig.COS_ACCESS_KEY,
    SecretKey: cosConfig.COS_SECRET_KEY,
})

// async function uploadFile(filePath, key, isDirectory) {
//     try {
//         var data = await cosInstance.putObject({
//             Bucket: cosConfig.COS_BUCKET,
//             Region: cosConfig.COS_REGION,
//             Key: key,
//             Body: isDirectory ? '' : fs.createReadStream(filePath),
//         })
//         return { err: null, data: data }
//     } catch (err) {
//         console.log(err,'err')
//         return { err: err, data: null }
//     }
// }
let obj = {
    dist: path.resolve(process.cwd(), `dist/${packageConfig.version}`),
    cosPathFile: `${prefix}/${packageConfig.version}/`,
    source: ''
}
checkRemoteResource(COS_CDN_HOST + obj.cosPathFile + 'index.html').then(isExist => {
    if(isExist) {
        console.log('版本已存在', COS_CDN_HOST + obj.cosPathFile)
    } else {
        uploadFolder(obj.dist, obj.cosPathFile)
    }
})
// 递归上传文件夹中的文件
function uploadFolder(localPath, cosPrefix) {
    fs.readdir(localPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach((filename) => {
            const filePath = path.join(localPath, filename);
            const cosFilePath = cosPrefix + filename;

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }

                if (stats.isFile()) {
                    // 上传文件到 COS
                    cosInstance.putObject({
                        Bucket: COS_BUCKET,
                        Region: cosConfig.COS_REGION,
                        Key: cosFilePath,
                        StorageClass: 'STANDARD',
                        Body: fs.createReadStream(filePath),
                    }, function(err, data) {
                        if (err) {
                            console.error('Error uploading file:', err);
                        } else {
                            console.log('File uploaded successfully:', data.Location);
                        }
                    });
                } else if (stats.isDirectory()) {
                    // 如果是目录，则递归上传
                    uploadFolder(filePath, cosFilePath + '/');
                }
            });
        });
    });
}


function checkRemoteResource(url) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0', // 设置 User-Agent 避免被服务器拒绝
        },
      };
      const req = https.request(url, options, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
      req.on('error', (err) => {
        reject(err);
      });
      req.end();
    });
  }
