FROM node:20-bookworm

# Set work dir for relative paths
WORKDIR /app

# Copy code from context to image
COPY . .
