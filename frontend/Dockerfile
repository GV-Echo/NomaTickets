FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app
# Копируем общий пакет shared в корень контейнера
COPY shared ./shared
# Копируем package.json и lock в папку frontend для кеширования зависимостей
COPY frontend/package.json frontend/yarn.lock ./frontend/
# Копируем tsconfig-ы в frontend
COPY frontend/tsconfig.json ./frontend/tsconfig.json
COPY frontend/tsconfig.app.json ./frontend/tsconfig.app.json

WORKDIR /app/frontend
RUN yarn install --frozen-lockfile
# Копируем всё содержимое frontend (исходники) в /app/frontend
COPY frontend .
ARG VITE_AUTH_API_URL=/auth
ARG VITE_BOOKING_API_URL=/booking
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_BOOKING_API_URL=$VITE_BOOKING_API_URL
RUN yarn build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Nginx для SPA: все не найденные маршруты отдаём index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
