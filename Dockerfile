FROM node:16-alpine

WORKDIR /app
COPY . /app

RUN npm install \
 && npm run build

FROM node:16-alpine

WORKDIR /app
COPY --from=0 /app/build build
COPY --from=0 /app/package.json /app/package-lock.json ./

ENV NODE_ENV production
RUN npm install \
 && npm install --global
ENTRYPOINT ["wonderland-stats"]
EXPOSE 3000
