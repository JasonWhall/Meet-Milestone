FROM node:10

ENV PATH=$PATH:/app/node_modules/.bin
WORKDIR /app
COPY . .
RUN npm install --production

ENTRYPOINT ["probot", "run"]
CMD ["./index.js"]