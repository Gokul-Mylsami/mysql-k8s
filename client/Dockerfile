FROM node:18-alpine as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest


COPY --from=builder /app/build /usr/share/nginx/html

COPY conf/templates/ /etc/nginx/templates/

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]