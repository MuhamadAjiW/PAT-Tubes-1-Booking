import { Router } from "express";
import { Route } from "../types/interfaces/route";
import { BookingController } from "../controllers/booking-controller";

export class BookingRoute implements Route{
    bookingController: BookingController;

    constructor() {
        this.bookingController = new BookingController();
    }

    getRoutes(): Router {
        return Router()
            .post("/api/book",
                this.bookingController.book())

            // _TODO: implement general CRUD functionality
            
            .get("/api/book/:identifier/status",
                this.bookingController.getBookingStatusByBookingId())
            .get("/api/book/status",
                this.bookingController.getBookingStatusByAcaraIdAndKursiId())
            .get("/api/book/file",
                this.bookingController.getBookingPDF());
    }
}