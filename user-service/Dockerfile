FROM node:alpine

WORKDIR /app

# Install dependencies for Swagger Codegen (Java)
RUN apk add --no-cache openjdk11

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code
COPY . .

# Compile TypeScript files
RUN npm run build

# Run Swagger JSON generation
RUN npm run generate-swagger

# Ensure the file exists
RUN ls -lah ./src/swagger.json  # Debugging step

# Ensure JAR file is present and executable
RUN ls -lah ./swagger-codegen-cli-2.4.44.jar
RUN chmod +x ./swagger-codegen-cli-2.4.44.jar

# Run Swagger Codegen to generate API documentation (e.g., HTML)
RUN java -jar /app/swagger-codegen-cli-3.0.20.jar generate -i /app/src/swagger.json -l html2 -o /app/src/docs

# Expose the necessary ports
EXPOSE 4000

# Command to run the application
CMD ["npx", "http-server", "/app/src/docs", "-p", "4000"]
