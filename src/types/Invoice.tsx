import { z } from 'zod';
import { InvoiceRequest } from './InvoiceRequest';

// TODO: Test
export const Invoice = z.object({
    invoiceNumber: z.string(),
    request: InvoiceRequest,
    timestamp: z.date(),
    status: z.string().refine(value => ["ERROR", "DONE", "PENDING", "FAILED"].includes(value), {
        message: "Status must be one of 'DONE', 'PENDING', 'FAILED'",
    }),
});
export type Invoice = z.infer<typeof Invoice>