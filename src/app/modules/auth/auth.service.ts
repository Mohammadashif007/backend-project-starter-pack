import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

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

    return {
        email: isUserExist.email,
    };
};

export const AuthServices = {
    credentialsLogin,
};
