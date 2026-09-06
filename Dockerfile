FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc tsconfig.base.json ./
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY packages/validation/package.json packages/validation/
COPY packages/utils/package.json packages/utils/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile

# Build shared packages
FROM deps AS build-packages
COPY packages/config/ packages/config/
COPY packages/types/ packages/types/
COPY packages/validation/ packages/validation/
COPY packages/utils/ packages/utils/
RUN pnpm --filter @toys/config build && pnpm --filter @toys/types build && pnpm --filter @toys/validation build && pnpm --filter @toys/utils build

# Build API
FROM build-packages AS build-api
COPY apps/api/ apps/api/
RUN pnpm --filter @toys/api build

# Production
FROM node:20-alpine AS production
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY packages/validation/package.json packages/validation/
COPY packages/utils/package.json packages/utils/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --prod

COPY --from=build-api /app/node_modules /app/node_modules
COPY --from=build-api /app/apps/api/dist /app/apps/api/dist

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "apps/api/dist/server.js"]
