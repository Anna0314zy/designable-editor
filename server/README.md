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


cd /opt/slides-engine/server

git pull

docker compose up -d --build