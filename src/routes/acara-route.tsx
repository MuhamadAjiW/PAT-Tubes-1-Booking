import { Router } from "express";
import { Route } from "./route";
import { AcaraController } from "../controllers/acara-controller";

export class AcaraRoute implements Route{
    AcaraController: AcaraController;

    constructor() {
        this.AcaraController = new AcaraController();
    }

    getRoutes(): Router {
        return Router()
            .get("/api/acara", async (req, res, next) => {
                try {
                    await this.AcaraController.getDistinctAcaraId(req, res);
                } catch (err) {
                    next(err);
                }
            });
    }
}