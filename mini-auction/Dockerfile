# ---------- build frontend ----------
FROM node:18-alpine AS webbuild
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN pnpm install --frozen-lockfile
COPY apps/web apps/web
RUN pnpm --filter web build

# ---------- build server ----------
FROM node:18-alpine AS serverbuild
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/server/package.json apps/server/package.json
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN pnpm install --frozen-lockfile
COPY apps/server apps/server
# copy built web to server public dir
COPY --from=webbuild /app/apps/web/dist /app/apps/server/dist-web
RUN pnpm --filter server build

# ---------- runtime ----------
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=serverbuild /app/apps/server/node_modules apps/server/node_modules
COPY --from=serverbuild /app/apps/server/dist apps/server/dist
COPY --from=serverbuild /app/apps/server/dist-web apps/server/dist-web
COPY --from=serverbuild /app/apps/server/package.json apps/server/package.json
EXPOSE 8080
CMD ["node", "apps/server/dist/index.js"]
