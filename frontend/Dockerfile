FROM alpine:3.20
WORKDIR /usr/local/app
RUN apk add --no-cache nodejs npm

COPY ./hivedrive/package.json ./package.json

COPY ./hivedrive/package-lock.json ./package-lock.json

RUN npm install --verbose --ignore-scripts

COPY ./hivedrive/ ./

EXPOSE 5173
CMD ["npm", "run", "dev"]
