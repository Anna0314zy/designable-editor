# React + TypeScript + Vite

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


`docker compose up --build -d` 可以拆成三部分看：

```bash
docker compose up --build -d
```

`docker compose up`  
按照当前目录的 `docker-compose.yml` 启动服务。你在 `editor` 目录执行时，它会读取：

```text
editor/docker-compose.yml
```

`--build`  
启动前先重新构建镜像。也就是会执行 [editor/Dockerfile](/Users/zouyu/Desktop/ledu/slides-engine/editor/Dockerfile) 里的步骤：安装依赖、打包前端、把产物放进 Nginx 镜像。

`-d`  
后台运行，detached mode。命令执行完会回到终端，但容器继续在后台跑。

所以整句意思是：

```text
根据 docker-compose.yml 构建镜像，然后启动容器，并让它在后台运行。
```

常用配套命令：

```bash
docker compose ps
```

看容器状态。

```bash
docker compose logs -f
```

实时看日志。

```bash
docker compose down
```

停止并删除这个 compose 启动的容器。