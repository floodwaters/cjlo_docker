# Create image based on the official Node 7 image from the dockerhub
FROM node:8

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app/express

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app/express

# use nodemon for development
RUN npm install --global nodemon

# Copy dependency definitions
COPY package.json /usr/src/app/express

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app/express

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["nodemon","npm", "start"]
