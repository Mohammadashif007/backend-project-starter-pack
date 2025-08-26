import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

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

        console.log("verifiedToken",verifiedToken);

            const isUserExist = await User.findOne({ email: verifiedToken.email });
            if (!isUserExist) {
                throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
            }
        
            if (
                isUserExist.isActive === IsActive.BLOCKED ||
                isUserExist.isActive === IsActive.INACTIVE
            ) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    `User is ${isUserExist.isActive}`
                );
            }
        
            if (isUserExist.isDeleted) {
                throw new AppError(httpStatus.BAD_REQUEST, `User is blocked`);
            }

        
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "You are not authorized!"
            );
        }
        req.user = verifiedToken;
        next();
    };
