import { Router } from "express";
import { Route } from "../types/interfaces/route";
import { BookingController } from "../controllers/booking-controller";

export class BookingRoute implements Route{
    BookingController: BookingController;

    constructor() {
        this.BookingController = new BookingController();
    }

    getRoutes(): Router {
        return Router()
            .post("/api/book",
                this.BookingController.book())

            // _TODO: implement general CRUD functionality
            
            .get("/api/book/:identifier/status",
                this.BookingController.getBookingStatusByBookingId())
            .get("/api/book/status",
                this.BookingController.getBookingStatusByAcaraIdAndKursiId())
            .get("/api/book/file",
                this.BookingController.getBookingPDF());
    }
}