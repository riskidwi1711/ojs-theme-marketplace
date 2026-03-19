# Multi-service Dockerfile: Next.js + Go Server

# =====================
# Stage 1: Go Builder
# =====================
FROM golang:1.25-alpine AS go-builder
WORKDIR /app/server

COPY server/go.mod server/go.sum ./
RUN go mod download

COPY server/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/bin/server ./main.go

# =====================
# Stage 2: Node Dependencies
# =====================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# =====================
# Stage 3: Next.js Builder
# =====================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_TYPESCRIPT_IGNORE=true

RUN npm run build

# =====================
# Stage 4: Runner
# =====================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=Asia/Jakarta

# Install supervisord for multi-process
RUN apk add --no-cache supervisor

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Go binary
COPY --from=go-builder /app/bin/server /app/bin/server
RUN chmod +x /app/bin/server

# Copy Next.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy supervisord config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY server/.env.production /app/server/.env

USER nextjs

EXPOSE 3000 4000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV SERVER_PORT=4000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
