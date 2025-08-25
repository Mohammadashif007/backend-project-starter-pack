/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createUserToken } from "../../utils/userToken";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const isUserExist = await User.findOne({ email: payload.email });
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exists");
    }
    const isPasswordMatch = await bcrypt.compare(
        payload.password as string,
        isUserExist.password as string
    );
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role,
    // };

    // const accessToken = generateToken(
    //     jwtPayload,
    //     envVars.JWT_ACCESS_SECRET,
    //     envVars.JWT_ACCESS_EXPIRES
    // );

    // const refreshToken = generateToken(
    //     jwtPayload,
    //     envVars.JWT_REFRESH_SECRET,
    //     envVars.JWT_REFRESH_EXPIRES
    // );

    const userToken = createUserToken(payload);

    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        data: rest,
    };
};

export const AuthServices = {
    credentialsLogin,
};
