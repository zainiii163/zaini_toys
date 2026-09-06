FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY packages/validation/package.json packages/validation/
COPY packages/utils/package.json packages/utils/
COPY apps/admin/package.json apps/admin/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY packages/ packages/
COPY apps/admin/ apps/admin/
RUN pnpm --filter @toys/config build && pnpm --filter @toys/types build && pnpm --filter @toys/validation build && pnpm --filter @toys/utils build
RUN pnpm --filter admin build

FROM nginx:alpine AS production
COPY --from=build apps/admin/dist /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
