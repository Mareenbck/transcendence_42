FROM node:latest

# Create app directory and set it as our working directory. This will be the working directory for your application:
WORKDIR /usr/src/app

# Copy application dependency to the container image.
COPY --chown=node:node package*.json ./

RUN npm install
# Install with 'npm ci' (see: https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)
# If you are building your code for production
# RUN npm ci --only=production

# Copy the app source into the image
COPY --chown=node:node . .

# # compile le main
# RUN npm run build

# Generate prisma client code
RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
