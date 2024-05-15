FROM alpine:latest
WORKDIR /usr/local/app
RUN apk add --no-cache nodejs npm

COPY ./hivedrive/package.json ./package.json
RUN npm instal
COPY ./hivedrive/ ./

EXPOSE 5173
CMD ["npm", "run", "dev"]
