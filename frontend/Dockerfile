FROM node:19-alpine

# Set work dir for relative paths
WORKDIR /app

# Install dependencies
COPY ./package*.json .
COPY ./yarn.lock .
RUN yarn install && yarn cache clean

# Copy code from context to image
COPY . .

RUN npm rebuild esbuild
CMD yarn dev
