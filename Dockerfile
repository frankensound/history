# Build
FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Run
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app ./

EXPOSE 3000

CMD [ "npm", "run", "dev" ]