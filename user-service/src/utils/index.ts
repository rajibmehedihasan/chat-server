import bcrypt from "bcryptjs";

class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(
        statusCode: number,
        message: string | undefined,
        isOperational = true,
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const encryptPassword = async (password: string) => {
    const encryptPassword = await bcrypt.hash(password, 12);
    return encryptPassword;
};

const isPasswordMatch = async (password: string, encryptedPassword: string) => {
    const isMatch = await bcrypt.compare(password, encryptedPassword);
    return isMatch;
};

export { ApiError, encryptPassword, isPasswordMatch };
