/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import passport from "passport";

const credentialsLogin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "local",
            async (err: any, user: any, info: any) => {
                if (err) {
                    // return next(err);
                    return next(new AppError(401, err));
                }

                if (!user) {
                    // return new AppError(401, "User dose not exist");
                    return next(new AppError(401, info.message));
                }

                const userToken = createUserToken(user);
                setAuthCookie(res, userToken);

                delete user.toObject().password;

                sendResponse(res, {
                    success: true,
                    statusCode: httpStatus.OK,
                    message: "User loggedIn successfully",
                    data: {
                        accessToken: userToken.accessToken,
                        refreshToken: userToken.refreshToken,
                        user,
                    },
                });
            }
        )(req, res, next);
    }
);

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
        success: true,
        message: "New access token provided",
        statusCode: httpStatus.OK,
        data: tokenInfo,
    });
});

const logOut = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    sendResponse(res, {
        success: true,
        message: "User logged out successfully",
        statusCode: httpStatus.OK,
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    sendResponse(res, {
        success: true,
        message: "Password changed successfully",
        statusCode: httpStatus.OK,
        data: null,
    });
});

const googleCallbackController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        let redirectTo = req.query.state ? (req.query.state as string) : "";
        if (redirectTo.startsWith("/")) {
            redirectTo = redirectTo.slice(1);
        }
        if (!user) {
            throw new AppError(401, "User not found from controller");
        }

        const tokenInfo = createUserToken(user);
        setAuthCookie(res, tokenInfo);
        res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
    }
);

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut,
    resetPassword,
    googleCallbackController,
};
