import PDFDocument from 'pdfkit';
import fs from 'fs'
import { SERVER_FILE_FOLDER } from './config';
import { BookingInfo } from '../types/BookingInfo';
import QRCode from 'qrcode'

export class PDFUtils{
    public static async generateBookingSuccess(info: BookingInfo): Promise<string>{
        const doc = new PDFDocument()
        console.log(SERVER_FILE_FOLDER);

        const filename: string = info.email + "-" + info.namaAcara + "-" + info.bookingId + "-" + info.invoiceNumber + ".pdf";

        doc.pipe(fs.createWriteStream(SERVER_FILE_FOLDER + filename));

        doc.fontSize(32).text('Booking Success', {align: 'center'}).moveDown();
        doc.fontSize(12).text("Thank you for booking with us").moveDown().moveDown();
        doc.fontSize(12).text(`Information`, { stroke: true} ).moveDown();
        doc.fontSize(12).text(`Email                       : ${info.email}`).moveDown();
        doc.fontSize(12).text(`Event                       : ${info.namaAcara}`).moveDown();
        doc.fontSize(12).text(`Ticket                       : ${info.kursiId}`).moveDown();
        doc.fontSize(12).text(`Invoice number       : ${info.invoiceNumber}`).moveDown();
        doc.fontSize(12).text(`Booking code`).moveDown();
        
        const qrCodeBuffer = await this.generateQRCode(info.bookingId.toString());
        doc.image(qrCodeBuffer, { fit: [150, 150], align: 'center' });

        doc.end()

        return filename;
    }

    public static async generateBookingFailed(info: BookingInfo): Promise<string>{
        const doc = new PDFDocument()
        const filename: string = info.email + "-" + info.namaAcara + "-" + info.bookingId + "-" + info.invoiceNumber + ".pdf";
        doc.pipe(fs.createWriteStream(SERVER_FILE_FOLDER + filename));

        doc.fontSize(32).text('Booking Failed', {align: 'center'}).moveDown();
        doc.fontSize(12).text("Sorry for the inconvenience",).moveDown().moveDown();
        doc.fontSize(12).text(`Information`, { stroke: true} ).moveDown();
        doc.fontSize(12).text(`Email                       : ${info.email}`).moveDown();
        doc.fontSize(12).text(`Event                       : ${info.namaAcara}`).moveDown();
        doc.fontSize(12).text(`Ticket                       : ${info.kursiId}`).moveDown();
        doc.fontSize(12).text(`Invoice number        : ${info.invoiceNumber}`).moveDown();
        doc.fontSize(12).text(`Reason                    : ${info.failureReason}`).moveDown();

        doc.end()

        return filename;
    }


    private static async generateQRCode(data: string) {
        try {
          const opts = {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
          };
    
          const dataUrl = QRCode.toDataURL(data,
            {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                margin: 1,
            });
          return dataUrl;
        } catch (error) {
          console.error('Error generating QR code:', error);
          throw error;
        }
      }
}