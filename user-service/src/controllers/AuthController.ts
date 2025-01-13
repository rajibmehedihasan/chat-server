import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../database";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import config from "../config/config";

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXPIRATION_DAYS = 90;

const expirationDate = new Date(
    Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);

const cookieOptions = {
    expires: expirationDate,
    secure: false,
    httpOnly: true,
};

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const user = await User.create({
            name,
            email,
            password: await encryptPassword(password),
        });

        const userData = {
            id: user._id,
            name: user.name,
            email,
        };

        return res.json({
            status: 200,
            message: "User registered successfully",
            data: userData,
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error",
        });
    }
};

const createToken = (user: IUser, res: Response) => {
    const { name, email, id } = user;
    const token = jwt.sign({ name, email, id }, jwtSecret, {
        expiresIn: "1h",
    });
    if (config.env === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    return token;
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await isPasswordMatch(password, user.password))) {
            throw new ApiError(401, "Invalid credentials");
        }

        const token = createToken(user!, res);

        return res.json({
            status: 200,
            message: "User logged in successfully",
            token,
        });
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};

export default { register, login };
