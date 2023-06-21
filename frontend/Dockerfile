FROM node as build-deps

WORKDIR /usr/src/app

# Copy the files required for installing node_modules
COPY package.json yarn.lock ./
RUN yarn

# Copy the rest of the code
COPY . ./

# Exporting NODE_OPTIONS because of webpack 4 exception
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]