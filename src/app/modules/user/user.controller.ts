/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUser(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getAllUsers();
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "All users retrieve successfully",
        data: result.data,
        meta: result.meta,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const verifiedToken = req.user;
    const userId = req.params.id;
    const userInfo = req.body;
    const result = await UserServices.updateUser(
        userId,
        userInfo,
        verifiedToken
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Users updated successfully",
        data: result,
    });
});

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
};
