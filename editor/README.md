# React + TypeScript + Vite

## Docker Deploy

服务器内存较小时不要在服务器上执行 Docker 构建。先在本地或 CI 构建并推送镜像，服务器只拉取镜像运行。

本地或 CI：

```bash
cd editor
export EDITOR_IMAGE=registry.example.com/slides-engine/editor:latest
export EDITOR_IMAGE=crpi-ioetel8j9mmp1wu4.cn-beijing.personal.cr.aliyuncs.com/zy5149/slides-engine-editor:latest

docker login --username=爱吃巧克力的小鱼儿zy crpi-ioetel8j9mmp1wu4.cn-beijing.personal.cr.aliyuncs.com
pnpm run docker:build
pnpm run docker:push
```

服务器：

```bash
cd editor
export EDITOR_IMAGE=crpi-ioetel8j9mmp1wu4.cn-beijing.personal.cr.aliyuncs.com/zy5149/slides-engine-editor:latest
docker login --username=爱吃巧克力的小鱼儿zy crpi-ioetel8j9mmp1wu4.cn-beijing.personal.cr.aliyuncs.com
pnpm run deploy

```

如果服务器没有 pnpm，也可以直接运行：

```bash
cd editor
export EDITOR_IMAGE=crpi-ioetel8j9mmp1wu4.cn-beijing.personal.cr.aliyuncs.com/zy5149/slides-engine-editor:latest

docker login crpi-ioetel8j9mmp1wu4.cn-beijing.personal.cr.aliyuncs.com
docker pull $EDITOR_IMAGE

docker stop slides-engine-editor 2>/dev/null || true
docker rm slides-engine-editor 2>/dev/null || true

docker run -d \
  --name slides-engine-editor \
  -p 8080:80 \
  -e API_UPSTREAM=http://8.141.7.113:5177 \
  --restart unless-stopped \
  $EDITOR_IMAGE
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
