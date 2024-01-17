FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install MySQL client
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY wait-for-mariadb.sh /usr/wait-for-mariadb.sh

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]

