<!-- SHOT_URL=http://127.0.0.1:5173 -->
<!-- 启动本地 -->
pnpm run local

<!-- 调本地服务 -->

curl -X POST 'http://127.0.0.1:8000' \
  -H 'Content-Type: application/json' \
  -H 'pagesnapshotid: local-test-001' \
  --data @local-shot-body.json

## 腾讯云 SCF Puppeteer 配置

`s.yaml` / `s.prod.yaml` / `s.fz.yaml` 仍是阿里云 FC 配置，里面的
`acs:fc:...Nodejs-Puppeteer17x` layer 不能在腾讯云 SCF 直接使用。

腾讯云部署使用自定义镜像：

- `code/Dockerfile` 安装 Chromium、Puppeteer 运行依赖和 CJK 字体。
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` 指定 Chromium 路径。
- `XDG_CONFIG_HOME=/var/user` 让 Chromium 读取 `code/fontconfig/fonts.conf`。
- 镜像通过 Dockerfile 的 `CMD ["node", "local-server.js"]` 启动，监听 `0.0.0.0:9000`。
- `code/fonts/` 可以放文泉驿正黑体或业务自定义字体；不放时镜像内置
  `font-noto-cjk` 负责中文渲染。
- 腾讯云函数类型使用 `type: web`，镜像端口使用 `imagePort: 9000`。
- 腾讯云 `scf` CLI 会读取 `tencent-image/serverless.yml`。
- 当前镜像地址是 `ccr.ccs.tencentyun.com/zy11/slide-screenshot:latest`。
- `npm run push-tencent-image` 推送后会写入 `tencent-image.digest.env`，
  部署时优先使用 `ccr.ccs.tencentyun.com/zy11/slide-screenshot:latest@sha256:...`。

构建并推送镜像：

```bash
cd serverless/screenshot
npm run push-tencent-image
```

部署腾讯云函数：

```bash
npm run deploy-tencent
```

本地镜像和部署环境配置在 `tencent-image.env`，需要填写：

- `COS_SECRET_KEY`
- `COS_SECRET_ID`

腾讯云 API 网关触发器已不支持新建，镜像配置不会自动创建 `apigw` 触发器。
函数部署完成后，在腾讯云控制台进入 `slide_screenshot_web` 函数详情，选择
“函数 URL”并新建 URL。基础 HTTP 调用建议选择公网访问、授权类型按业务
需要选择“开放”或“CAM 鉴权”。

curl -X POST 'https://1329132138-i4sojuk93k.ap-beijing.tencentscf.com' \
  -H 'Content-Type: application/json' \
  -H 'pagesnapshotid: test-page-001' \
  --data @local-shot-body.json
