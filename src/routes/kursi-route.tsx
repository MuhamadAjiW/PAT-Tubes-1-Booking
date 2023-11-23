import { Router } from "express";
import { Route } from "./route";
import { KursiController } from "../controllers/kursi-controller";

export class KursiRoute implements Route{
    KursiController: KursiController;

    constructor() {
        this.KursiController = new KursiController();
    }

    getRoutes(): Router {
        return Router()
            .get("/api/kursi",
                this.KursiController.getDistinctKursiId())
    }
}