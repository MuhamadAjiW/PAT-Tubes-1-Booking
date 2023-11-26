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
                
            .post("/api/acara",
                this.AcaraController.createAcara())
            .get("/api/acara/:identifier",
                this.AcaraController.getAcaraById())
            .put("/api/acara/:identifier",
                this.AcaraController.updateAcaraById())
            .delete("/api/acara/:identifier",
                this.AcaraController.deleteAcaraById());
    }
}