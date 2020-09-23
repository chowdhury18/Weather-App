FROM node:14.10.1-alpine3.12

WORKDIR /usr/app

ENV PORT 8000

COPY . .

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]