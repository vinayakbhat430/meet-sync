# Stage 1: Build the application
FROM node:alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies (without dev dependencies)
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Run the application
FROM node:alpine AS runtime

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port your application runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
