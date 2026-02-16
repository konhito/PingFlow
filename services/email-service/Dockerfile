FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (not used for consumer, but for health checks if added)
EXPOSE 3006

# Start the service
CMD ["npm", "start"]
