# Build with the same Node and pnpm versions as .mise.toml.
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV CI=true

RUN npm install --global pnpm@10.34.3
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY .mise.toml tsconfig.json index.html vite.config.ts ./
COPY .figma/make/site.json ./.figma/make/site.json
COPY src ./src
COPY public ./public
COPY scripts ./scripts

# These optional values are public build settings, never secrets.
ARG VITE_SITE_URL=""
ARG VITE_ALLOW_INDEX="false"
ENV VITE_SITE_URL=${VITE_SITE_URL} \
    VITE_ALLOW_INDEX=${VITE_ALLOW_INDEX}
RUN pnpm typecheck && pnpm build && pnpm verify

# The running image contains the verified static output, with no Node runtime.
FROM nginx:stable-alpine AS runtime
RUN rm -f /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/
RUN nginx -t

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
