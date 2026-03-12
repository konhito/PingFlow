FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat dumb-init
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY services/email-service/ ./services/email-service/
COPY prisma/ ./prisma/

RUN pnpm install --frozen-lockfile
RUN cd services/email-service && pnpm run build
RUN pnpm deploy --filter @pingflow/email-service --prod /app/out

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=builder /app/out ./

RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001
USER nodeuser
EXPOSE 3006

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3006/health', r => process.exit(r.statusCode===200?0:1))" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
