import { Router } from "express";
import { WebhookController } from "../controllers/webhook-controller";
import { Route } from "./route";

export class WebhookRoute implements Route{
    webhookController: WebhookController;

    constructor() {
        this.webhookController = new WebhookController();
    }

    getRoutes(): Router{
        return Router()
            .post("/webhook/test",
                this.webhookController.testWebhook())
            .post("/webhook",
                this.webhookController.register())
    }
}