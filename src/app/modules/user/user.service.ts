import AppError from "../../errorHelpers/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: IUser) => {
    const isUserExist = await User.findOne({ email: payload.email });
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(
        payload.password as string,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider = { provider: "credentials", providerId: payload.email };
    const result = await User.create({
        ...payload,
        auths: [authProvider],
        password: hashedPassword,
    });
    return result;
};
const getAllUsers = async () => {
    const result = await User.find({});

    const totalUsers = await User.countDocuments();
    return {
        data: result,
        meta: {
            total: totalUsers,
        },
    };
};

export const UserServices = {
    createUser,
    getAllUsers,
};
