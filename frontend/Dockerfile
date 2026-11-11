FROM node:20 AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

COPY . .
# Vite bakes VITE_* variables into the JS at build time, so they must exist here (not at runtime).
ARG BASE_URL
ENV VITE_BASE_URL=$BASE_URL
RUN pnpm build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80