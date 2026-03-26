FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
COPY host/package.json ./host/package.json
COPY mfe-admin/package.json ./mfe-admin/package.json
COPY mfe-events/package.json ./mfe-events/package.json
COPY shared-webpack-config/package.json ./shared-webpack-config/package.json
RUN corepack enable && corepack prepare yarn@1.22.19 --activate
RUN apk add --no-cache python3 make g++ git
RUN yarn install --frozen-lockfile --network-concurrency 1

COPY mfe-admin ./mfe-admin

ARG NODE_ENV=production
ARG HOST_URL
ENV NODE_ENV=${NODE_ENV}
ENV HOST_URL=${HOST_URL}

RUN yarn workspace @nomatickets/mfe-admin build

FROM nginx:1.27-alpine
COPY --from=builder /app/mfe-admin/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




