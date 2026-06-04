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

腾讯云部署有两种方式。

### 方式一：代码包 + Layer

如果没有腾讯云 TCR 镜像仓库，可以用代码包部署，把 `node_modules` 放到云函数层：

1. 确认 `serverless/screenshot/code/node_modules` 已经安装好依赖。
2. 部署依赖层：

```bash
cd serverless/screenshot
npm run deploy-tencent-layer
```

部署完成后，在输出或腾讯云控制台里拿到 `slide-screenshot-node-modules`
的最新版本号，然后部署函数代码：

```bash
export TENCENT_SCF_NODE_MODULES_LAYER_VERSION=1
export COS_SECRET_ID=你的腾讯云 SecretId
export COS_SECRET_KEY=你的腾讯云 SecretKey
npm run deploy-tencent-code
```

也可以复制本地环境配置后用一键脚本：

```bash
cp deploy.tencent.env.example deploy.tencent.env
npm run deploy-tencent
```

腾讯云 API 网关触发器已不支持新建，代码包配置不会再自动创建
`apigw` 触发器。函数部署完成后，在腾讯云控制台进入
`slide_screenshot` 函数详情，选择“函数 URL”并新建 URL。基础 HTTP
调用建议选择公网访问、授权类型按业务需要选择“开放”或“CAM 鉴权”。

注意：腾讯云代码包配置使用 `Nodejs18.15`。`node_modules` 层只解决 JS 依赖。Puppeteer 还需要 Linux Chromium
可执行文件和系统库，腾讯云 SCF 的 Layer 会挂载到 `/opt`，Node.js 的
`NODE_PATH` 默认包含 `/opt/node_modules`。如果你使用自己的 Chromium 层，
建议把可执行文件放到 `/opt/bin/chromium`，或者把
`PUPPETEER_EXECUTABLE_PATH` 改成真实路径。

### 方式二：自定义镜像

腾讯云镜像部署建议使用自定义镜像：

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

curl -X POST 'https://1329132138-i4sojuk93k.ap-beijing.tencentscf.com' \
  -H 'Content-Type: application/json' \
  -H 'pagesnapshotid: test-page-001' \
  --data @local-shot-body.json
