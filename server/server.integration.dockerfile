FROM denoland/deno:alpine

RUN mkdir /server
ADD ./ /server/

EXPOSE 3555

CMD /bin/deno run --allow-net --allow-read /server/src/tests/deno/server.integration.ts