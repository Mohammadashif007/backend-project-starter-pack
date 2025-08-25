import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

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

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logOut,
};
