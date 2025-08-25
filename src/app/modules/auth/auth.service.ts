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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };

    const userToken = createUserToken(jwtPayload);

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

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
};
