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
                this.KursiController.getDistinctKursiId())

            .post("/api/acara/:acaraId/kursi",
                this.KursiController.createKursi())
            .get("/api/acara/:acaraId/kursi/:kursiId",
                this.KursiController.getKursiById())
            .put("/api/acara/:acaraId/kursi/:kursiId",
                this.KursiController.updateKursiById())
            .delete("/api/acara/:acaraId/kursi/:kursiId",
                this.KursiController.deleteKursiById());
    }
}