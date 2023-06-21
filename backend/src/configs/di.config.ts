import { Container } from "inversify";

import { TYPES } from "./di.types.config";
import { UserCtrl } from '../components/user/user.controller';
import { UserDataLayer } from '../components/user/user.datalayer';

import { LoggerDriver } from '../drivers/logger.driver';
import MorganMiddleware from '../middlewares/morgan.middleware';
import { DefaultPresentationLayer } from '../components/default.presentation';
import { UserPresntationLayer } from "../components/user/user.presentation";

export const container: Container = new Container();

container.bind<LoggerDriver>(TYPES.LoggerDriver).to(LoggerDriver).inSingletonScope();

container.bind<MorganMiddleware>(TYPES.MorganMiddleware).to(MorganMiddleware).inSingletonScope();

container.bind<DefaultPresentationLayer>(TYPES.DefaultPresentationLayer).to(DefaultPresentationLayer).inSingletonScope();
container.bind<UserPresntationLayer>(TYPES.UserPresentationLayer).to(UserPresntationLayer).inSingletonScope();
container.bind<UserCtrl>(TYPES.UserCtrl).to(UserCtrl).inSingletonScope();
container.bind<UserDataLayer>(TYPES.UserDataLayer).to(UserDataLayer).inSingletonScope();
// container.bind<IDefaultDataLayer>(TYPES.DefaultDataLayer).to(DefaultDataLayer);
