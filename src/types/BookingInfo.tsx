import { z } from 'zod';

export const BookingInfo = z.object({
    email: z.string().email(),
    namaAcara: z.string(),
    kursiId: z.number().int(),
    invoiceNumber: z.string(),
    bookingId: z.number().int(),
    failureReason: z.string().optional()
});
export type BookingInfo = z.infer<typeof BookingInfo>