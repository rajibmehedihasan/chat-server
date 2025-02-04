import express, { Express } from "express";
import Server from "http";
import userRouter from "./routes/authRoutes";
import { errorConverter, errorHandler } from "./middleware";
import { connectDB } from "./database";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";
import { setupSwagger } from "./swagger";
import path from "path";
import { readFileSync } from "fs";
import swaggerUi from "swagger-ui-express";

const app: Express = express();
let server: Server.Server;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(errorConverter);
app.use(errorHandler);

connectDB();

// setupSwagger(app);

// Load Swagger JSON file
const swaggerFilePath = path.join(__dirname, "/swagger.json");
const swaggerDocument = JSON.parse(readFileSync(swaggerFilePath, "utf8"));

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server = app.listen(config.PORT, () => {
    console.log(`Server started at http://localhost:${config.PORT}`);
});

const initializeRabbitMQClient = async () => {
    try {
        await rabbitMQService.init();
        console.log("RabbitMQ client initialized successfully");
    } catch (error) {
        console.error("Error initializing RabbitMQ client: ", error);
    }
};

initializeRabbitMQClient();

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
