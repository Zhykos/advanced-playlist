FROM denoland/deno:alpine

RUN mkdir /server
ADD ./ /server/

EXPOSE 3555

CMD cd /server && /bin/deno run --allow-net --allow-read ./src/tests/deno/server.integration.ts