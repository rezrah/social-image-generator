FROM node:16

ARG OAUTH_CLIENT_ID_ARG
ARG OAUTH_CLIENT_SECRET_ARG

ENV OAUTH_CLIENT_ID=$OAUTH_CLIENT_ID_ARG
ENV OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET_ARG

# Create app directory
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install
# RUN npm install --only=production

COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]