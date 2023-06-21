import { inject, injectable } from "inversify";

import { InputUserData, User, UserModel } from "./user.model";

@injectable()
export class UserDataLayer {
    constructor() {}

    async createUser(userData: InputUserData): Promise<User> {
        return await UserModel.create(userData);
    }

    async getUsers(): Promise<User[]> {
        // WARN: Need to be implementation of paging in case there are more documents than signle response can handle
        return await UserModel.find({});
    }

    async updateUser(newUserData: Partial<InputUserData>): Promise<void> {
        if (!newUserData.email)
            throw new Error('Email must be provided for update');
        await UserModel.updateOne({ email: newUserData.email }, newUserData);
    }

    async exists(email: string): Promise<boolean> {
        const users: User = await UserModel.findOne({ email });
        return !!users;
    }

    async deleteUser(email: string): Promise<void> {
        await UserModel.remove({ email });
    }
}