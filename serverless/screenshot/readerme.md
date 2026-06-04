<!-- SHOT_URL=http://127.0.0.1:5173 SCREENSHOT_RENDER_TIMEOUT_MS=90000  -->
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

腾讯云部署建议使用自定义镜像：

- `code/Dockerfile` 安装 Chromium、Puppeteer 运行依赖和 CJK 字体。
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser` 指定 Chromium 路径。
- `XDG_CONFIG_HOME=/var/user` 让 Chromium 读取 `code/fontconfig/fonts.conf`。
- `code/fonts/` 可以放文泉驿正黑体或业务自定义字体；不放时镜像内置
  `font-noto-cjk` 负责中文渲染。
- 腾讯云函数 handler 使用 `index.main_handler`。
- `s.tencent.yaml` 是腾讯云 SCF 部署模板，部署前要替换 TCR 镜像地址和环境变量。

构建镜像时在 `serverless/screenshot/code` 目录执行：

```bash
docker build -t slide-screenshot-scf .
```

推送到腾讯云 TCR 后，把镜像地址填到 `s.tencent.yaml` 的
`inputs.image.imageUrl`。

部署到腾讯云时需要在 SCF 环境变量中继续配置：

- `COS_SECRET_KEY`
- `COS_SECRET_ID`
- `COS_BUCKET`
- `COS_REGION`
- `HOST`
- `SHOT_URL`
- `SCREENSHOT_RENDER_TIMEOUT_MS`
