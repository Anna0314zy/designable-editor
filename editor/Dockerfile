FROM docker.m.daocloud.io/library/node:20-bookworm-slim AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY common/animate/package.json ./common/animate/package.json
COPY common/render-components/package.json ./common/render-components/package.json
COPY common/render-context/package.json ./common/render-context/package.json
COPY common/render-core/package.json ./common/render-core/package.json
COPY common/slide-editor/package.json ./common/slide-editor/package.json
COPY common/slide-fonts/package.json ./common/slide-fonts/package.json
COPY common/slide-shape/package.json ./common/slide-shape/package.json
COPY common/slide-shot/package.json ./common/slide-shot/package.json
COPY packages/core/package.json ./packages/core/package.json
COPY packages/react/package.json ./packages/react/package.json
COPY packages/react-sandbox/package.json ./packages/react-sandbox/package.json
COPY packages/react-settings-form/package.json ./packages/react-settings-form/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/typings/package.json ./packages/typings/package.json
COPY editor/package.json ./editor/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY common ./common
COPY packages ./packages
COPY editor ./editor

RUN pnpm --dir editor exec vite build --mode prod
RUN cp -R editor/dist/$(node -p "require('./editor/package.json').version") /tmp/editor-dist

FROM docker.m.daocloud.io/library/nginx:stable

ENV API_UPSTREAM=http://8.141.7.113:5177

COPY editor/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /tmp/editor-dist /usr/share/nginx/html

EXPOSE 80
