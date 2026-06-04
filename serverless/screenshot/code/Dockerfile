ARG NODE_IMAGE=node:16.13-alpine
FROM ${NODE_IMAGE}

RUN apk add --no-cache \
  chromium \
  font-noto-cjk \
  freetype \
  harfbuzz \
  nss \
  ttf-freefont

WORKDIR /var/user

ENV PUPPETEER_SKIP_DOWNLOAD=true \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  XDG_CONFIG_HOME=/var/user

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 9000

CMD ["node", "local-server.js"]
