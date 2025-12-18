# Stage 1: Build
FROM node:22 AS builder

# Update NPM ke versi spesifik (atau terbaru 11.x)
RUN npm install -g npm@11.6.2

WORKDIR /usr/src/app

# Argument untuk environment variables
ARG NUXT_PUBLIC_BASE_URL
ARG API_URL
ARG KLIK_API_TOKEN

# Set sebagai ENV agar terbaca saat 'npm run build'
ENV NUXT_PUBLIC_BASE_URL=$NUXT_PUBLIC_BASE_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Build Nuxt 3 (output akan ada di folder .output)
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim AS runner

WORKDIR /usr/src/app

# Nuxt 3 hanya butuh folder .output untuk running di production
COPY --from=builder /usr/src/app/.output ./.output

# Ekspos port default Nuxt
EXPOSE 3000

# Standar port untuk Nitro engine
ENV PORT=3000
ENV HOST=0.0.0.0

# Menjalankan server Nitro
CMD ["node", ".output/server/index.mjs"]
