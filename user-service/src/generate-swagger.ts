import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Service API",
            version: "1.0.0",
            description: "Automatically generated Swagger documentation",
        },
    },
    apis: ["./src/routes/*.ts"], // Update this based on your project structure
};

// Generate Swagger JSON
const swaggerSpec = swaggerJSDoc(options);
const outputPath = path.join(__dirname, "swagger.json");

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log("✅ Swagger JSON generated successfully at", outputPath);
