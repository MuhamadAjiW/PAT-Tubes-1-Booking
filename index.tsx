import { App } from "./src/app";
import { PDFUtils } from "./src/utils/pdf-utils";

// const app = new App;
// app.run();

PDFUtils.generateBookingSuccess("a.pdf", 
    {
        email: "test@gmail.com",
        namaAcara: "tai",
        kursiId: 1,
        invoiceNumber: "255225",
        bookingId: 5,
        failureReason: "TAI LU ANJINGG"
    }
);