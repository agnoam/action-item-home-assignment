import { Application } from "express";
import * as oasTools from '@oas-tools/core';

import YAML from 'js-yaml';
import fs from 'fs';
import path from 'path';

// import { ProbeServer } from "../drivers/probe.driver";

const docPath: string = path.resolve(__dirname, '../api/swagger.yaml');
const swaggerDocument: Object = YAML.load(fs.readFileSync(docPath).toString()) as Object;

export const SwaggerConfig = async (app: Application): Promise<void> => {
    try {
        console.log(`Searching for config file in ${path.resolve(__dirname)}`);
        const config: oasTools.Options = {
            oasFile: docPath,
            middleware: {
                validator: {
                    // TODO: Check about progress of https://github.com/oas-tools/oas-tools/issues/367
                    responseValidation: false
                },
                router: {
                    controllers: path.resolve(__dirname)
                }
            }
        }
        await oasTools.initialize(app, config);
    } catch (ex) {
        console.error('SwaggerConfig() ex:', ex);
    }
}

const prepareSwaggerDoc = (swaggerDoc: any): Object => {
    const _swaggerDocument = { ...swaggerDoc } as any;
            
    // For now overriding just host property
    // _swaggerDocument.host = process.env.SWAGGER_HOST || _swaggerDocument.host;
    
    return _swaggerDocument;
}