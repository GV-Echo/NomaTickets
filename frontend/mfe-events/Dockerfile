FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git python3 make g++

COPY package.json yarn.lock ./
COPY shared-webpack-config ./shared-webpack-config
COPY mfe-events ./mfe-events
COPY mfe-admin ./mfe-admin
COPY host ./host

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile --production=false

RUN yarn workspace @nomatickets/mfe-events build

FROM nginx:1.27-alpine

COPY --from=builder /app/mfe-events/dist /usr/share/nginx/html/mfe-events

RUN rm /etc/nginx/conf.d/default.conf
RUN printf '%s\n' "server {" \
	"    listen 80;" \
	"    server_name _;" \
	"    location /mfe-events/ {" \
	"        root /usr/share/nginx/html;" \
	"        index index.html;" \
	"        try_files \$uri \$uri/ /mfe-events/index.html;" \
	"    }" \
	"    location / {" \
	"        return 404;" \
	"    }" \
	"}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


