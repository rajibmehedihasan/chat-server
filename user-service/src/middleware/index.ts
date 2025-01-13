import { ErrorRequestHandler } from "express";
import { ApiError } from "../utils";

const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || (error instanceof Error ? 400 : 500);

        const message =
            error.message ||
            (statusCode === 400 ? "Bad Request" : "Internal server error");

        error = new ApiError(
            statusCode,
            message,
            false,
            error.stack.toString()
        );
    }
    next(error);
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        statusCode = 500;
        message = "Internal server error";
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }

    res.status(statusCode).send(response);
    next();
};
