FROM denoland/deno:alpine

RUN apk update
RUN apk upgrade -U -a
RUN apk upgrade busybox
RUN apk upgrade zlib
RUN apk upgrade openssl
RUN apk upgrade libcrypto1.1

RUN mkdir -p /server/src/main
ADD ./src/main /server/src/main

RUN mkdir -p /server/specs
ADD ./specs /server/specs

RUN mkdir -p /server
ADD ./.env /server/.env

EXPOSE 3000

CMD cd /server && /bin/deno run --allow-net --allow-read ./src/main/deno/server.ts