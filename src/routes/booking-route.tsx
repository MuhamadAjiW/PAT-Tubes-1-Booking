import { Router } from "express";
import { Route } from "./route";
import { BookingController } from "../controllers/booking-controller";

export class BookingRoute implements Route{
    BookingController: BookingController;

    constructor() {
        this.BookingController = new BookingController();
    }

    getRoutes(): Router {
        return Router()
            .post("/api/book", async (req, res, next) => {
                try {
                    await this.BookingController.book(req, res);
                } catch (err) {
                    next(err);
                }
            });
    }
}