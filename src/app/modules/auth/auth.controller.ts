import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
    const userInfo = req.body;
    const result = await AuthServices.credentialsLogin(userInfo);
    sendResponse(res, {
        success: true,
        message: "User logged in successfully",
        statusCode: httpStatus.OK,
        data: result,
    });
});

export const AuthControllers = {
    credentialsLogin,
};
