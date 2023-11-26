import { z } from 'zod';

export const InvoiceRequest = z.object({
    email: z.string().email(),
    acaraId: z.number().int(),
    kursiId: z.number().int(),
    userId: z.number().int(),
    bookingId: z.number().int()
});
export type InvoiceRequest = z.infer<typeof InvoiceRequest>