FROM node:alpine

RUN npm i -g @nestjs/cli


WORKDIR /usr/src/app

ENTRYPOINT ["sh", "-c", "npm install && npm run build && npm run prisma:generate && npm run prisma:seed && npm run start:prod"]

# FROM node:latest

# # Create app directory and set it as our working directory. This will be the working directory for your application:
# WORKDIR /usr/src/app

# # Copy application dependency to the container image.
# COPY --chown=node:node package*.json ./
# COPY --chown=node:node prisma ./prisma/

# RUN npm install
# RUN npx prisma generate

# # Copy the app source into the image
# COPY --chown=node:node . .

# # # compile le main
# RUN npm run build

# EXPOSE 3000
# EXPOSE 8001
# CMD ["npm", "run", "start:migrate:dev"]

# # Install with 'npm ci' (see: https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)
# # If you are building your code for production
# # RUN npm ci --only=production

# # CMD ["npx", "prisma", "db", "seed"]

# FROM node:latest AS production

# # Create app directory and set it as our working directory for subsequent operation
# WORKDIR /usr/src/app

# # Copy application dependency to the container image.
# COPY --chown=node:node package*.json ./

# COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

# # Copy the app source into the image
# COPY --chown=node:node . .

# RUN npm run build

# ENV NODE_ENV production


# # Running `npm ci` removes the existing node_modules directory.
# # Passing in --only=production ensures that only the production dependencies are installed.
# # This ensures that the node_modules directory is as optimized as possible.
# RUN npm ci --only=production && npm cache clean --force

# # Start the server using the production build
# CMD [ "npm", "run", "start:prod" ]

