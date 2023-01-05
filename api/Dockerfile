FROM node:16

# Create app directory
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install
# RUN npm install --only=production

COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]