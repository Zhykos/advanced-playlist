FROM denoland/deno:alpine

RUN mkdir /server
ADD ./ /server/

EXPOSE 3666

CMD /bin/deno run --allow-net --allow-read /server/src/tests/deno/server.stubbed.ts