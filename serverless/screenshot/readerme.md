## 阿里云 FC 截图函数

当前发布入口只保留阿里云函数计算：

```bash
cd serverless/screenshot
npm run deploy
```

部署时传入 COS 或回调地址：

```bash
COS_SECRET_ID=xxx \
COS_SECRET_KEY=xxx \
COS_BUCKET=xxx \
COS_REGION=ap-beijing \
HOST=https://example.com \
npm run deploy
```

`s.fz.yaml` 会创建/更新：

- 服务：`slide-screenshot`
- 函数：`slide_screenshot`
- 入口：`code/index.js` 的 `handler`
- 运行时：`nodejs16`
- 触发器：HTTP 匿名触发
- Puppeteer 层：`Nodejs-Puppeteer17x`

本地调试：

```bash
npm run local
```

调用示例：

```bash
curl -X POST 'http://127.0.0.1:9000' \
  -H 'Content-Type: application/json' \
  -H 'pagesnapshotid: local-test-001' \
  --data @local-shot-body.json
```

`COS_SECRET_ID`、`COS_SECRET_KEY`、`COS_BUCKET` 和 `HOST` 不要写入仓库。
部署脚本会读取当前 shell 环境变量并生成临时 yaml，部署结束后自动删除。
