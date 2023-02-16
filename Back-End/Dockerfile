FROM node:latest

# Create app directory and set it as our working directory. This will be the working directory for your application:
WORKDIR /usr/src/app

# Copy application dependency to the container image.
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm install
# Install with 'npm ci' (see: https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)
# If you are building your code for production
# RUN npm ci --only=production
RUN npx prisma generate

# Copy the app source into the image
COPY --chown=node:node . .

# # compile le main
RUN npm run build

EXPOSE 3000
EXPOSE 8001
CMD ["npm", "run", "start:migrate:dev"]
