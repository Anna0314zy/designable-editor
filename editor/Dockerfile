ARG NODE_IMAGE=docker.m.daocloud.io/library/node:20-bookworm-slim
ARG NGINX_IMAGE=docker.m.daocloud.io/library/nginx:stable

FROM ${NODE_IMAGE} AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY common ./common
COPY packages ./packages
COPY editor ./editor

RUN pnpm install --frozen-lockfile
RUN pnpm --dir editor copyFontToPublic && pnpm --dir editor exec vite build --mode prod
RUN cp -R editor/dist/$(node -p "require('./editor/package.json').version") /tmp/editor-dist

FROM ${NGINX_IMAGE}

ENV API_UPSTREAM=http://8.141.7.113:5177

COPY editor/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /tmp/editor-dist /usr/share/nginx/html

EXPOSE 80
