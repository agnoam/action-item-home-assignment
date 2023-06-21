import { inject, injectable } from "inversify";
import { Logger } from 'winston';

import { TYPES } from "../../configs/di.types.config";
import { LoggerDriver } from '../../drivers/logger.driver';
import { User, InputUserData } from './user.model';
import { UserDataLayer } from "./user.datalayer";
import { UserExistsError } from "../../constants/errors";

console.log("import app.controller");

@injectable()
export class UserCtrl {
    private Logger: Logger;

    constructor(
        @inject(TYPES.LoggerDriver) LoggerDriver: LoggerDriver,
        @inject(TYPES.UserDataLayer) private userDataLayer: UserDataLayer
    ) {
        this.Logger = LoggerDriver.Logger;
    }
        
    async getUsers(): Promise<User[]> {
        return await this.userDataLayer.getUsers();
    }

    async createUser(userData: InputUserData): Promise<void> {
        if (await this.userDataLayer.exists(userData.email)) 
            throw new UserExistsError();
        await this.userDataLayer.createUser(userData);
    }

    async updateUser(email: string, userData: Partial<InputUserData>): Promise<void> {
        if (await this.userDataLayer.exists(email)) 
            throw new UserExistsError();

        userData.email = email;
        await this.userDataLayer.updateUser(userData);
    }

    async deleteUser(email: string): Promise<void> {
        await this.userDataLayer.deleteUser(email);
    }
}
