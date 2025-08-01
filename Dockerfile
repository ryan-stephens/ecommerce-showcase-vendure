FROM node:22.11.0

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy all the source code
COPY . .

# Run the build process (which needs the dev dependencies)
RUN npm run build

# Remove the node_modules folder and reinstall only production dependencies
RUN rm -rf node_modules && npm install --production