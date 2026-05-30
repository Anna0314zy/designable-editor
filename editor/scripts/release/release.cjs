const COS = require('cos-nodejs-sdk-v5')
const cosConfig = require('./cos.config.json')
const fs = require('fs')
const path = require('path')
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv)
const env = args.mode || 'test'
const { prefix } = require('./publish.config.json')[env]
const version = require('../../package.json').version
const cosInstance = new COS({
    SecretId: cosConfig[env].COS_ACCESS_KEY,
    SecretKey: cosConfig[env].COS_SECRET_KEY,
})
async function uploadFile(filePath, key, isDirectory) {
   
    try {
        var data = await cosInstance.putObject({
            Bucket: cosConfig[env].COS_BUCKET,
            Region: cosConfig[env].COS_REGION,
            Key: key,
            Body: isDirectory ? '' : fs.createReadStream(filePath),
        })
        return { err: null, data }
    } catch (err) {
        console.log(err,'err')
        return { err: err, data: null }
    }
}

let obj = {
    dist: path.resolve(process.cwd(), `dist/${version}`),
    cosPathFile: `${prefix}/${version}/`,
    source: ''
}
uploadAllFile(obj)
function uploadAllFile(obj,parentPath = '') {
    fs.readdir(obj.dist, async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err)
            return
        }
        for(const item of files){
            const filePath = path.resolve(process.cwd(), `dist/${version}/${obj.source}/${item}`)
            const fileKey = obj.cosPathFile + item
            const fileStats = fs.statSync(filePath)
            if (fileStats.isFile()) {
                // 处理文件逻辑
                const { data } = await uploadFile(
                    filePath,
                    fileKey,
                )
                if (data.statusCode === 200) {
                    console.log('上传成功', fileKey)
                }
                // TODO: 在特殊处理中执行您的逻辑
            } else if (fileStats.isDirectory()) {
                // 处理文件夹逻辑
                uploadAllFile({
                    dist: filePath,
                    cosPathFile:  obj.cosPathFile + item + '/',
                    source: parentPath + '/' +item
                },item)
            }
        }
    })
}
// 更新版本号
