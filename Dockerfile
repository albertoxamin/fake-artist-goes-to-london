# Use the official Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:alpine3.18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the web service on container startup.
CMD [ "node", "index.js" ]
