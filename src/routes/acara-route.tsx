import { Router } from "express";
import { Route } from "../types/interfaces/route";
import { AcaraController } from "../controllers/acara-controller";

export class AcaraRoute implements Route{
    AcaraController: AcaraController;

    constructor() {
        this.AcaraController = new AcaraController();
    }

    getRoutes(): Router {
        return Router()
            .get("/api/acara",
                this.AcaraController.getDistinctAcaraId())

            // TODO: Test
            .post("/api/acara",
                this.AcaraController.createAcara())
            // TODO: Test
            .get("/api/acara/:identifier",
                this.AcaraController.getAcaraById())
            // TODO: Test
            .put("/api/acara/:identifier",
                this.AcaraController.updateAcaraById())
            // TODO: Test
            .delete("/api/acara/:identifier",
                this.AcaraController.deleteAcaraById());
    }
}