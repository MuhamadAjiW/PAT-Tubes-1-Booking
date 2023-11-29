import { Router } from "express";
import { Route } from "../types/interfaces/route";
import { KursiController } from "../controllers/kursi-controller";

export class KursiRoute implements Route{
    kursiController: KursiController;

    constructor() {
        this.kursiController = new KursiController();
    }

    getRoutes(): Router {
        return Router()
            .get("/api/kursi", 
                this.kursiController.getDistinctKursiId())

            // TODO: Test
            .post("/api/acara/:acaraId/kursi",
                this.kursiController.createKursi())
            // TODO: Test
            .get("/api/acara/:acaraId/kursi/:kursiId",
                this.kursiController.getKursiById())
            // TODO: Test
            .put("/api/acara/:acaraId/kursi/:kursiId",
                this.kursiController.updateKursiById())
            // TODO: Test
            .delete("/api/acara/:acaraId/kursi/:kursiId",
                this.kursiController.deleteKursiById());
    }
}