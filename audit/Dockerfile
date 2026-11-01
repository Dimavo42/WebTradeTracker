FROM node:22-alpine

WORKDIR /app

# better-sqlite3 compiles from source on Alpine
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@10.32.1
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3002

CMD ["pnpm", "start:prod"]