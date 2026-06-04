FROM node:16.13-alpine

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
