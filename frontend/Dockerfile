FROM node:latest

# RUN apk update
# RUN apk upgrade

# Create app directory and set it as our working directory. This will be the working directory for your application:
WORKDIR /usr/src/app

# Copy application dependency ,  package*.json , all fucture directory ,  to the container image.
COPY package*.json ./
RUN npm install
# I had prb for copy with failed it ==> https://stackoverflow.com/questions/63783323/getting-copy-failed-stat-when-trying-to-copy-package-json-file-in-docker-on-dig
COPY . ./

EXPOSE 8080
