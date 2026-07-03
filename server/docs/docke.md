服务端发版可以按这条主线理解：

```text
写代码
-> 提交代码
-> CI/CD 拉代码
-> 安装依赖
-> 构建 NestJS
-> 生成 Docker 镜像
-> 推送镜像仓库
-> 服务器/集群拉取镜像
-> 注入环境变量
-> 启动容器
-> 入口层把外部请求转发到 NestJS
-> 健康检查通过
-> 对外提供服务
```

**Docker 里一般要有这些**

1. `Dockerfile`

负责定义 NestJS 服务怎么被构建成镜像。

典型内容是：

```text
基础 Node 镜像
安装依赖
编译 TypeScript
只拷贝 dist + 生产依赖
设置 NODE_ENV=production
暴露端口
启动 node dist/main.js
```

最终容器里主要有：

```text
dist
node_modules 生产依赖
package.json
```

不应该有：

```text
.env
.git
src 源码
测试文件
devDependencies
本地 node_modules
```

2. `.dockerignore`

控制哪些文件不要进入 Docker 构建上下文。

常见内容：

```gitignore
node_modules
dist
.git
.env
.env.*
coverage
npm-debug.log
pnpm-debug.log
Dockerfile
docker-compose.yml
```

3. 镜像 tag 规则

不要只用 `latest`，一般用：

```text
项目名:git-sha
项目名:版本号
项目名:环境-日期
```

例如：

```text
registry.example.com/my-api:8f3a91c
registry.example.com/my-api:v1.3.0
```

4. 环境变量配置

镜像不绑定具体环境。运行时注入：

```text
NODE_ENV
PORT
DATABASE_URL
REDIS_URL
JWT_SECRET
OSS 配置
第三方服务 key
```

这些来自：

```text
docker run -e
docker compose env_file
Kubernetes Secret / ConfigMap
CI/CD 变量
云平台环境变量
```

5. 启动命令

生产环境一般是：

```bash
node dist/main.js
```

不是：

```bash
npm run start:dev
nest start --watch
```

6. 健康检查

NestJS 提供一个接口，例如：

```text
GET /health
```

用于判断服务是否正常。

部署平台用它做：

```text
启动探活
存活探活
流量切换判断
```

7. 入口层

NestJS 容器自己监听内部端口，比如 `3000`。

外部请求一般是：

```text
用户
-> Nginx / 云负载均衡 / Ingress / API Gateway
-> NestJS 容器 :3000
```

如果你是一台服务器自己部署，常见是：

```text
Nginx :80/:443
-> Docker 容器 :3000
```

但 Nginx 不建议放进 NestJS 镜像里，最好单独一个 Nginx 容器或宿主机 Nginx。

**一个完整但简单的发版设计**

```text
代码仓库
  |
  | push
  v
CI/CD
  |
  | npm ci
  | npm run build
  | docker build
  v
镜像仓库
  |
  | docker push
  v
服务器 / Kubernetes
  |
  | docker pull
  | 注入环境变量
  | 启动容器
  v
NestJS 容器
  |
  | 暴露 3000
  v
Nginx / 负载均衡
  |
  | 绑定域名和 HTTPS
  v
用户访问
```

一句话总结：

**Docker 负责把 NestJS 服务打包成可运行的、环境无关的镜像；CI/CD 负责构建和推送镜像；服务器或集群负责拉镜像和注入配置；Nginx 或负载均衡负责接外部流量；NestJS 容器只负责跑业务服务。**