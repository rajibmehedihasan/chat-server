import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import config from "../config/config";

interface TokenPayload {
    id: string;
    name: string;
    email: string;
    iat: number;
    exp: number;
}

interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthRequest extends Request {
    user: IUser;
}

const jwtSecret = config.JWT_SECRET as string;

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new ApiError(401, "Authorization header is missing");
    }

    const [, token] = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

        req.user = {
            _id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            password: "",
            createdAt: new Date(decoded.iat * 1000),
            updatedAt: new Date(decoded.exp * 1000),
        };

        return next();
    } catch (error) {
        console.error(error);
        return next(new ApiError(401, "Invalid token"));
    }
};

export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
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

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
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
