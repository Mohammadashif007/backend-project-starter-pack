/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import {
    createNewAccessTokenWithRefreshToken,
    createUserToken,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

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

    
    const userToken = createUserToken(isUserExist);

    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        data: rest,
    };
};

const getNewAccessToken = async (refreshToken: string) => {
    const accessToken = createNewAccessTokenWithRefreshToken(refreshToken);
    return accessToken;
};

const resetPassword = async (
    oldPassword: string,
    newPassword: string,
    decodedToken: JwtPayload
) => {
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found from service");
    }
    const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        user?.password as string
    );
    if (!isOldPasswordMatch) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Old Password does not match"
        );
    }

    user.password = await bcrypt.hash(
        newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    );
    user.save();
};

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
};
