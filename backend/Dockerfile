FROM node:14.10.1-alpine3.12

WORKDIR /usr/app

ENV APPID YOUR_API_Key
ENV MAP_ENDPOINT http://api.openweathermap.org/data/2.5
ENV TARGET_CITY Helsinki,fi
ENV PORT 9000

COPY . .

RUN npm install

EXPOSE 9000

CMD ["npm", "start"]