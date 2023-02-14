FROM node:19-alpine

# Set work dir for relative paths
RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY ./frontend/package*.json /app
RUN yarn install && yarn cache clean

# Copy code from context to image
COPY . .

ENV PATH ./node_modules/.bin/:$PATH
