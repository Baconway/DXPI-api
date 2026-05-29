FROM node:22-alpine

WORKDIR /DXPI

COPY package*.json .

RUN npm install

COPY . .

RUN npm build

EXPOSE 5000

CMD [ "npm", 'start' ]