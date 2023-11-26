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

            // TODO: Test
            .post("/api/acara/:acaraId/kursi",
                this.KursiController.createKursi())
            // TODO: Test
            .get("/api/acara/:acaraId/kursi/:kursiId",
                this.KursiController.getKursiById())
            // TODO: Test
            .put("/api/acara/:acaraId/kursi/:kursiId",
                this.KursiController.updateKursiById())
            // TODO: Test
            .delete("/api/acara/:acaraId/kursi/:kursiId",
                this.KursiController.deleteKursiById());
    }
}