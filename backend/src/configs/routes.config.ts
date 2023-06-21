import { container } from './di.config';
import { TYPES } from "./di.types.config";

import { DefaultPresentationLayer } from '../components/default.presentation';
import { UserPresntationLayer } from '../components/user/user.presentation';

const defaultPL: DefaultPresentationLayer = container.get(TYPES.DefaultPresentationLayer);
const userPL: UserPresntationLayer = container.get(TYPES.UserPresentationLayer);

console.log("import routes.config");

// This file exposes all wanted BLOC (Business logic) functions implemntation to the `swagger.yaml`
export const getUsers_R = userPL.getUsers_R.bind(userPL);
export const addUser_R = userPL.addUser_R.bind(userPL);
export const updateUser_R = userPL.updateUser_R.bind(userPL);
export const deleteUser_R = userPL.deleteUser_R.bind(userPL);
export const health_R = defaultPL.health_R.bind(defaultPL);