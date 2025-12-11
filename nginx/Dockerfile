FROM node:20.19.5-alpine3.21 AS build

WORKDIR /app

RUN npm i -g pnpm && \
    pnpm config set store-dir /pnpm/store

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json shared/package.json
COPY frontend/package.json frontend/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY shared shared
COPY frontend frontend

RUN pnpm --filter=frontend build && \
    find frontend/dist -type f \( \
      -name "*.css" -o \
      -name "*.js" -o \
      -name "*.svg" \
    \) -exec gzip -9k {} \;

FROM nginx:1.28.0-alpine3.21-slim

COPY --from=build /app/frontend/dist /var/www/bluedrive.com

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d /etc/nginx/conf.d
COPY nginx/includes /etc/nginx/includes
