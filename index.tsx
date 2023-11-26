import { App } from "./src/app";
import { SignatureUtil } from "./src/utils/signature-utils";
// import { PDFUtils } from "./src/utils/pdf-utils";

const app = new App;
app.run();

// console.log(SignatureUtil.generateSignature("test@gmail.com-tai-5-255225.pdf", SignatureUtil.PDFExpiry))
// console.log(
//     await PDFUtils.generateBookingSuccess(
//         {
//             email: "test@gmail.com",
//             namaAcara: "tai",
//             kursiId: 1,
//             invoiceNumber: "255225",
//             bookingId: 5,
//             failureReason: "TAI LU ANJINGG"
//         }
//     )
// );