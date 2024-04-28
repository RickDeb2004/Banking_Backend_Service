# Specify a base image
FROM node:14-alpine

WORKDIR /usr/app

# Install some depenendencies
COPY ./package.json ./
RUN npm install
COPY ./ ./

EXPOSE 3000

# Default command
CMD ["node", "src/index.js"]