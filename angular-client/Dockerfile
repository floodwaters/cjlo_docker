# Create image based on the official Node 7 image from dockerhub
FROM node:8

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app/angular

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app/angular

# Copy dependency definitions
COPY package.json /usr/src/app/angular

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app/angular

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "start"]
