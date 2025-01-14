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

const authMiddleware = async (
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
