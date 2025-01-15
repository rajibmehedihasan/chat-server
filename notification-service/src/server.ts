import express, { Express } from "express";
import { Server } from "http";
import { errorConverter, errorHandler } from "./middleware";
import config from "./config/config";
import { rabbitMQService } from "./services/RabbitMQService";

const app: Express = express();

let server: Server;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorConverter);
app.use(errorHandler);

server = app.listen(config.PORT, () => {
    console.log(`Server started at http://localhost:${config.PORT}`);
});

const initializeRabbitMQServer = async () => {
    try {
        await rabbitMQService.init();
        console.log("RabbitMQ server initialized successfully");
    } catch (error) {
        console.error("Failed to initialize RabbitMQ server", error);
    }
};

initializeRabbitMQServer();

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
