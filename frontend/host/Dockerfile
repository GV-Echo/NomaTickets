FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git python3 make g++

ARG EVENTS_URL
ARG ADMIN_URL
ENV EVENTS_URL=$EVENTS_URL
ENV ADMIN_URL=$ADMIN_URL

COPY package.json yarn.lock ./
COPY shared-webpack-config ./shared-webpack-config
COPY host ./host
COPY mfe-events ./mfe-events
COPY mfe-admin ./mfe-admin

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile --production=false

RUN yarn workspace @nomatickets/host build

FROM nginx:1.27-alpine

COPY --from=builder /app/host/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
RUN printf '%s\n' "server {" \
	"    listen 80;" \
	"    server_name _;" \
	"    root /usr/share/nginx/html;" \
	"    index index.html;" \
	"    location / {" \
	"        try_files \$uri \$uri/ /index.html;" \
	"    }" \
	"}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



