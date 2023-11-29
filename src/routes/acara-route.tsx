import { Router } from "express";
import { Route } from "../types/interfaces/route";
import { AcaraController } from "../controllers/acara-controller";

export class AcaraRoute implements Route{
    acaraController: AcaraController;

    constructor() {
        this.acaraController = new AcaraController();
    }

    getRoutes(): Router {
        return Router()
            .get("/api/acara",
                this.acaraController.getDistinctAcaraId())

            // TODO: Test
            .post("/api/acara",
                this.acaraController.createAcara())
            // TODO: Test
            .get("/api/acara/:identifier",
                this.acaraController.getAcaraById())
            // TODO: Test
            .put("/api/acara/:identifier",
                this.acaraController.updateAcaraById())
            // TODO: Test
            .delete("/api/acara/:identifier",
                this.acaraController.deleteAcaraById());
    }
}