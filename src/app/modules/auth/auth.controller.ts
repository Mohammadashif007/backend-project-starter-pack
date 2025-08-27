import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.body;
    const tokenInfo = await AuthServices.credentialsLogin(userInfo);
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
        success: true,
        message: "User logged in successfully",
        statusCode: httpStatus.OK,
        data: tokenInfo,
    });
});

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
    async (req: Request, res: Response) => {
        let redirectTo = req.query.state? req.query.state as string : "";

        if(redirectTo.startsWith("/")){
            redirectTo = redirectTo.slice(1)
        }

        const user = req.user;
        console.log("User", user);
        if (!user) {
            throw new AppError(httpStatus.BAD_REQUEST, "User not found");
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
