import "reflect-metadata"; // Used for dependcy-injection (inversify)

import http, { Server } from "http";
import express, { Application } from "express";
import os from "os";
import winston from "winston";
import { inject, injectable } from "inversify";
import cors from 'cors';

import { container } from "./configs/di.config";
import { LoggerDriver } from "./drivers/logger.driver";
import { TYPES } from "./configs/di.types.config";
import { ServerMiddleware } from "./middlewares/server.middleware";
import { SwaggerConfig } from "./configs/swagger.config";
import MorganMiddleware from './middlewares/morgan.middleware';
import ErrorMiddleware from "./middlewares/error.middleware";
import { initializeMongo } from "./configs/mongo.config";

import dotenv from 'dotenv';
dotenv.config();

@injectable()
export class ServerBoot {
	private Logger: winston.Logger;
	private port: number = +process.env.PORT || 8810;
	app: Application = express(); // Exported for testings
	server: Server = this.createServer();

	constructor(
		@inject(TYPES.LoggerDriver) private LoggerDriver: LoggerDriver, 
		@inject(TYPES.MorganMiddleware) private MorganMiddleware: MorganMiddleware
	) {}

	private createServer(): Server {
		return http.createServer(this.app);
	}

	async listen(): Promise<Application> {
		await this.initializeConfigs();
		await this.loadMiddlewares();
		
		const localIP: string = this.findMyIP();
		return new Promise( (resolve, reject) => {
			this.server.listen(this.port, () => {
				this.Logger.info(`Our app server is running on http://${os.hostname()}:${this.port}`);
				this.Logger.info(`Server running on: http://${localIP}:${this.port}`);
				resolve(this.app);
			});
		});
	}

	private async initializeConfigs(): Promise<void> {
		this.LoggerDriver.initialize();
		initializeMongo();
		
		this.Logger = this.LoggerDriver.Logger;
		this.Logger.info('Configurations initialized successfuly');
	}

	private async loadMiddlewares(): Promise<void> {
		this.app.use( cors() );
		this.app.use( express.json() );
		this.app.use( express.urlencoded({ extended: true }) );
		this.app.use( ErrorMiddleware );
		this.app.use( this.MorganMiddleware.implementation );
		this.app.use( ServerMiddleware );

		await SwaggerConfig(this.app);
	}

	public findMyIP(): string {
		// Get the server's local ip
		const ifaces: NetworkInterface = os.networkInterfaces();
		let localIP: string;

		Object.keys(ifaces).forEach((ifname) => {
			let alias: number = 0;

			ifaces[ifname].forEach((iface) => {
				if ("IPv4" !== iface.family || iface.internal !== false) {
					// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
					return;
				}

				if (alias < 1) {
					localIP = iface.address;
				}
				
				++alias;
			});
		});

		return localIP; 
	}
} 

interface NetworkInterface {
	[index: string]: os.NetworkInterfaceInfo[];
}

if (process.env.NODE_ENV !== "test") {
	// Running the server
	const _loggerConfig = container.get<LoggerDriver>(TYPES.LoggerDriver);
	const _morganMiddleware = container.get<MorganMiddleware>(TYPES.MorganMiddleware);
	
	new ServerBoot(_loggerConfig, _morganMiddleware).listen();
}