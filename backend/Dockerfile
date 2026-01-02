FROM node:20.19.5-alpine3.21 AS build

WORKDIR /app

RUN npm i -g pnpm && \
    pnpm config set store-dir /pnpm/store

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY backend/prisma/schema.prisma backend/prisma/schema.prisma
COPY backend/tsconfig.json backend/tsconfig.json
RUN pnpm --filter backend exec prisma generate

COPY shared shared
COPY backend backend

RUN pnpm --filter=shared --filter=backend build && \
    pnpm deploy --filter=backend --no-optional --prod /prod/backend

FROM node:20.19.5-alpine3.21

WORKDIR /app

RUN apk add --no-cache curl

RUN mkdir -p /uploads && \
    chown -R node:node /uploads

COPY --from=build /prod/backend/dist .
COPY --from=build /prod/backend/package.json package.json
COPY --from=build /prod/backend/node_modules node_modules

EXPOSE 3000
USER node

CMD ["node", "server"]
