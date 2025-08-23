import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser) => {
    const result = await User.create(payload);
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
