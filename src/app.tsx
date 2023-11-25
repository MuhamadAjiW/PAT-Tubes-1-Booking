import { Express, Request, Response } from "express";
import express from 'express';
import cors from 'cors';
import requestIp from 'request-ip'
import { SERVER_PORT } from "./utils/config";
import { PaymentController } from "./controllers/payment-controller";
import { WebhookRoute } from "./routes/webhook-route";
import { BookingRoute } from "./routes/booking-route";
import { AcaraRoute } from "./routes/acara-route";
import { KursiRoute } from "./routes/kursi-route";
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from './middlewares/error-middleware';

require("express-async-errors")

export class App{
    server: Express;

    constructor(){
        const webhookRoute = new WebhookRoute(this);
        const bookingRoute = new BookingRoute();
        const acaraRoute = new AcaraRoute();
        const kursiRoute = new KursiRoute();
        const paymentController = new PaymentController();

        this.server = express();
        this.server.get('/', (req: Request, res: Response) => {
            res.send(`Server setup at ${SERVER_PORT}`);
        });

        this.server.use(
            requestIp.mw(),
            cors(),
            express.json(),
            express.urlencoded({ extended: true }),
            webhookRoute.getRoutes(),
            bookingRoute.getRoutes(),
            acaraRoute.getRoutes(),
            kursiRoute.getRoutes(),
            notFoundErrorHandler,
            conflictErrorHandler,
            badRequestErrorHandler,
            unauthorizedErrorHandler,
            generalErrorHandler
        )

        paymentController.initialize();
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


