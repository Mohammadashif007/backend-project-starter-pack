import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";

export const checkAuth =
    (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                "Access token does not exists"
            );
        }
        const verifiedToken = verifyToken(
            accessToken,
            envVars.JWT_ACCESS_SECRET
        ) as JwtPayload;
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "You are not authorized!"
            );
        }
        req.user = verifiedToken;
        next();
    };
