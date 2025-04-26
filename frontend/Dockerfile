FROM node:20-alpine

# Set work dir for relative paths
WORKDIR /app

# Enable Corepack for Yarn
RUN corepack enable

# Copy package files first (for better caching)
COPY package.json yarn.lock .yarnrc.yml ./

# Explicitly configure Yarn to use node_modules
ENV YARN_NODE_LINKER=node-modules

# Install dependencies
RUN yarn install

# Copy remaining code from context to image
COPY . .

# Expose port
EXPOSE 3000

# Start the application with the host flag
CMD ["yarn", "dev", "--host", "0.0.0.0"]
