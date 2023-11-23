import { Express, Request, Response } from "express";
import express from 'express';
import { SERVER_PORT } from "./config";
import { WebhookRoute } from "./routes/webhook-route";
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from './middlewares/error-middleware';

require("express-async-errors")

export class App{
    server: Express;

    constructor(){
        const webhookRoute = new WebhookRoute();

        this.server = express();
        this.server.get('/', (req: Request, res: Response) => {
            res.send(`Server setup at ${SERVER_PORT}`);
        });

        this.server.use(
            express.json(),
            express.urlencoded({ extended: true }),
            webhookRoute.getRoutes(),
            notFoundErrorHandler,
            conflictErrorHandler,
            badRequestErrorHandler,
            unauthorizedErrorHandler,
            generalErrorHandler
        )
    }

    run () {
        process.on("uncaughtException", (error) =>{
            console.error("Server encountered an uncaught error: ", error);
            console.log("\n\nServer continues running");
        })

        this.server.listen(SERVER_PORT, () =>{
            console.log(`Server setup at ${SERVER_PORT}`);
        });
    }
}