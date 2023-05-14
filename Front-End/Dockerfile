FROM node:latest AS dev

# RUN apk update
# RUN apk upgrade

# Create app directory and set it as our working directory. This will be the working directory for your application:
WORKDIR /usr/src/app

# Copy application dependency ,  package*.json , all fucture directory ,  to the container image.
COPY --chown=node:node package*.json ./

RUN npm install
# I had prb for copy with failed it ==> https://stackoverflow.com/questions/63783323/getting-copy-failed-stat-when-trying-to-copy-package-json-file-in-docker-on-dig
COPY --chown=node:node . .

EXPOSE 8080

CMD ["npm", "run", "dev"]

# FROM node:latest AS build

# WORKDIR /usr/src/app

# COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

# COPY --chown=node:node . .

# RUN npm run build

# FROM nginx:latest AS production

# COPY ./conf/nginx.conf /etc/nginx/nginx.conf
# COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]
