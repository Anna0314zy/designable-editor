const COS = require('cos-nodejs-sdk-v5')
const cosConfig = require('./cos.config.json')
const fs = require('fs')
const path = require('path')

const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv)
const env = args.mode || 'test'
const { prefix } = require('./publish.config.json')[env]
const version = require('../../package.json').version
const distDir = path.resolve(process.cwd(), `dist/${version}`)
const concurrency = Number(args.concurrency || process.env.UPLOAD_CONCURRENCY || 6)

const cosInstance = new COS({
    SecretId: cosConfig[env].COS_ACCESS_KEY,
    SecretKey: cosConfig[env].COS_SECRET_KEY,
})

async function uploadFile(filePath, key) {
    const data = await cosInstance.putObject({
        Bucket: cosConfig[env].COS_BUCKET,
        Region: cosConfig[env].COS_REGION,
        Key: key,
        Body: fs.createReadStream(filePath),
    })

    if (data.statusCode !== 200) {
        throw new Error(`Upload failed: ${key}, statusCode: ${data.statusCode}`)
    }

    console.log('上传成功', key)
}

function walkFiles(dir) {
    const result = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
        const filePath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            result.push(...walkFiles(filePath))
        } else if (entry.isFile()) {
            result.push(filePath)
        }
    }

    return result
}

async function uploadWithConcurrency(files) {
    let nextIndex = 0

    async function worker() {
        while (nextIndex < files.length) {
            const filePath = files[nextIndex++]
            const relativePath = path.relative(distDir, filePath).split(path.sep).join('/')
            const fileKey = `${prefix}/${version}/${relativePath}`

            await uploadFile(filePath, fileKey)
        }
    }

    const workerCount = Math.min(concurrency, files.length)
    await Promise.all(Array.from({ length: workerCount }, worker))
}

async function main() {
    if (!fs.existsSync(distDir)) {
        throw new Error(`Dist directory does not exist: ${distDir}`)
    }

    const files = walkFiles(distDir)
    console.log(`开始上传 ${files.length} 个文件，并发数 ${Math.min(concurrency, files.length)}`)
    await uploadWithConcurrency(files)
    console.log('全部上传完成')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
