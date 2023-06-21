import { inject, injectable } from "inversify";
import { Request, Response } from 'express';
import winston from 'winston';

import { ResponseStatus } from "../../constants/consts";
import { TYPES } from "../../configs/di.types.config";
import { LoggerDriver } from "../../drivers/logger.driver";
import { UserCtrl } from './user.controller';
import { InputUserData } from "./user.model";
import { UserExistsError } from "../../constants/errors";

@injectable()
export class UserPresntationLayer {
    logger: winston.Logger;

    constructor(
        @inject(TYPES.LoggerDriver) private loggerDriver: LoggerDriver, 
        @inject(TYPES.UserCtrl) private userCtrl: UserCtrl
    ) {
        this.logger = this.loggerDriver.Logger;
    }

    async getUsers_R(req: Request, res: Response): Promise<void> {
        let resStatus: number = ResponseStatus.Ok;
        let resBody: any = { description: 'All users returned' };
        let _ex: any;
        
        try {
            resBody.users = await this.userCtrl.getUsers();
        } catch(ex) {
            _ex = ex;
            resStatus = ResponseStatus.InternalError;
            resBody = { description: 'Failed to find users' };
        }

        res.status(resStatus).json(resBody);
        _ex && this.logger.error('Exception occurred at getUsers_R()', _ex);
    }

    async addUser_R(req: Request, res: Response): Promise<void> {
        let resStatus: number = ResponseStatus.Created;
        let resBody: any = { description: 'User created successfully' };
        let _ex: any;
        
        try {
            const user = req.body;
            resBody.user = await this.userCtrl.createUser(user);
        } catch(ex) {
            _ex = ex;
            if (ex instanceof UserExistsError) {
                resStatus = ResponseStatus.BadRequest;
                resBody = { description: 'User already exists' };
            } else {
                resStatus = ResponseStatus.InternalError;
                resBody = { description: 'Failed to find users' };
            }
        }

        res.status(resStatus).json(resBody);
        _ex && this.logger.error('Exception occurred at addUser_R()', _ex);
    }

    async updateUser_R(req: Request, res: Response): Promise<void> {
        let resStatus: number = ResponseStatus.Created;
        let resBody: any = { description: 'User updated successfully' };
        let _ex: any;
        
        try {
            const userMail: string = req.params.email as string;
            const user = req.body;
            await this.userCtrl.updateUser(userMail, user as InputUserData);
        } catch(ex) {
            _ex = ex;
            resStatus = ResponseStatus.InternalError;
            resBody = { description: 'Failed to update user' };
        }

        res.status(resStatus).json(resBody);
        _ex && this.logger.error('Exception occurred at updateUser_R()', _ex);
    }

    async deleteUser_R(req: Request, res: Response): Promise<void> {
        let resStatus: number = ResponseStatus.Ok;
        let resBody: any = { description: 'User updated successfully' };
        let _ex: any;
        
        try {
            const userMail: string = req.params.email as string;
            await this.userCtrl.deleteUser(userMail);
        } catch(ex) {
            _ex = ex;
            resStatus = ResponseStatus.InternalError;
            resBody = { description: 'Failed to delete user' };
        }

        res.status(resStatus).json(resBody);
        _ex && this.logger.error('Exception occurred at deleteUser_R()', _ex);
    }
}