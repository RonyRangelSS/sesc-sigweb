# Use the official Node.js image as the base image
FROM node:20.9.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Install a static file server to serve the built application
RUN npm install -g serve

# Start the application using the static file server
CMD ["serve", "-s", "dist", "-l", "3000"]