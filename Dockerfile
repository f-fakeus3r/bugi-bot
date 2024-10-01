# Use a Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the .env file from the root to the working directory
COPY .env ./

# Copy the package.json and package-lock.json (if present)
COPY package.json ./
COPY package-lock.json ./  

# Copy the groq-ai folder to the working directory
COPY ./groq-ai ./groq-ai

# Install dependencies
RUN npm install

# Expose port (adjust if necessary)
EXPOSE 8080

# Start the application with the correct file name
CMD ["node", "groq-ai/call-groq-ai.js"]
