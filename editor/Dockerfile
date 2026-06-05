FROM docker.m.daocloud.io/library/node:20-bookworm-slim AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY common ./common
COPY packages ./packages
COPY editor ./editor

RUN pnpm install --frozen-lockfile
RUN cd editor && pnpm copyFontToPublic && pnpm exec vite build --mode prod
RUN cp -R editor/dist/$(node -p "require('./editor/package.json').version") /tmp/editor-dist

FROM docker.m.daocloud.io/library/nginx:stable

ENV API_UPSTREAM=http://8.141.7.113:5177

COPY editor/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /tmp/editor-dist /usr/share/nginx/html

EXPOSE 80
