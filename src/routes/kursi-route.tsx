import { Router } from "express";
import { Route } from "../types/interfaces/route";
import { KursiController } from "../controllers/kursi-controller";

export class KursiRoute implements Route{
    KursiController: KursiController;

    constructor() {
        this.KursiController = new KursiController();
    }

    getRoutes(): Router {
        return Router()
            .get("/api/kursi", 
                this.KursiController.getDistinctKursiId());
    }
}