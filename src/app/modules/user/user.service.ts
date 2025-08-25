import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }

    console.log(decodedToken);

    if (payload.role) {
        console.log("payload.role");
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not authorized to change the role"
            );
        }

        if (
            payload.role === Role.SUPER_ADMIN &&
            decodedToken.role === Role.ADMIN
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not authorized to change the role"
            );
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(
            payload.password,
            envVars.BCRYPT_SALT_ROUND
        );
    }

  

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

 

    return updatedUser;
};

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
};
