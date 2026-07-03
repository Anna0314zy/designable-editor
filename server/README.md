# Slides Engine Server

Production-oriented NestJS service for the classroom slides editor.

## Stack

- NestJS
- PostgreSQL
- Prisma
- JWT + RBAC
- DTO validation
- Docker Compose for local infrastructure

## Local Development

```bash
cp .env.example .env
# 启用本地服务器
docker compose up -d postgres 
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The API keeps the existing frontend contract under `/classroom-slides`.

## API Testing

After starting the service with `npm run dev`, open:

- Swagger UI: http://localhost:5177/api-docs
- OpenAPI JSON: http://localhost:5177/api-docs-json

You can test requests directly in Swagger UI with the `Try it out` button.
For endpoints that require login, call `POST /classroom-slides/auth/login` first,
then paste the returned `accessToken` into the Swagger `Authorize` dialog as a bearer token.
The refresh token is stored as an HttpOnly cookie and is not returned in the JSON response.

You can also test from the terminal:

```bash
curl -X POST http://localhost:5177/classroom-slides/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

curl -X POST http://localhost:5177/classroom-slides/auth/login \
  -c /tmp/slides-engine-cookie.txt \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'

curl http://localhost:5177/classroom-slides/auth/me \
  -H "Authorization: Bearer <accessToken>"

curl -X POST http://localhost:5177/classroom-slides/auth/refresh \
  -b /tmp/slides-engine-cookie.txt \
  -c /tmp/slides-engine-cookie.txt

curl -X POST http://localhost:5177/classroom-slides/auth/logout \
  -b /tmp/slides-engine-cookie.txt
```

For automated checks, add Jest/Supertest specs under `src/**/*.spec.ts` and run:

```bash
npm run test
```
npx prisma studio


ssh root@8.141.7.113

cd /opt/slides-engine/server

git pull

docker compose up -d --build

给后端绑定一个域名，比如：
api.your-domain.com
解析到服务器 IP：

服务器上用 Nginx 反代到本地后端 5177
server {
  listen 80;
  server_name http://zy123.ee.cd;

  location / {
    proxy_pass http://8.141.7.113:5177;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
用 certbot 配 HTTPS：
sudo certbot --nginx -d api.your-domain.com
改 editor 的接口地址：
editor/env/.env.test 里把：

VITE_API_SERVER ='http://8.141.7.113:5177'
改成：

VITE_API_SERVER ='https://api.your-domain.com'
后端 CORS 允许 GitHub Pages：
服务器 server/.env：

CORS_ORIGIN=https://anna0314zy.github.io
重新构建并发布 editor。
重点：不能用 HTTPS 页面请求 HTTP API。
所以不是改 CORS 就能好，必须让后端变成 HTTPS。