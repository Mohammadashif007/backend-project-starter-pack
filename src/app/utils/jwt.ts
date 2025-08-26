import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

export const generateToken = (
    payload: JwtPayload,
    secret: string,
    expiresIn: string
) => {

    console.log(payload);
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
    return token;
};

export const verifyToken = (token: string, secret: string) => {
    const verifiedToken = jwt.verify(token, secret);
    if(!verifiedToken){
        throw new AppError(httpStatus.BAD_REQUEST, "Token not found")
    }
    return verifiedToken;
};
