import { Router } from "express";
import { WebhookController } from "../controllers/webhook-controller";
import { Route } from "../types/interfaces/route";
import { App } from "../app";

export class WebhookRoute implements Route{
    webhookController: WebhookController;
    app: App;

    constructor(app: App) {
        this.webhookController = new WebhookController();
        this.app = app;
    }

    getRoutes(): Router{
        return Router()
            .post("/webhook/test",
                this.webhookController.testWebhook())
            .post("/webhook/clients",
                this.webhookController.registerClient())
            .post("/webhook",
                this.webhookController.registerWebhook(this.app))
    }
}