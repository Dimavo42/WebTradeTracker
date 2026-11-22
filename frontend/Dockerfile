FROM node:20 AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

COPY . .
# Vite bakes VITE_* variables into the JS at build time, so they must exist here (not at runtime).
# Default "/api" = same origin; nginx.conf proxies it to the BFF.
ARG BASE_URL=/api
ENV VITE_BASE_URL=$BASE_URL
# Show the User/Admin role picker on the register page (local testing only)
ARG ALLOW_ADMIN_SIGNUP=false
ENV VITE_ALLOW_ADMIN_SIGNUP=$ALLOW_ADMIN_SIGNUP
RUN pnpm build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80