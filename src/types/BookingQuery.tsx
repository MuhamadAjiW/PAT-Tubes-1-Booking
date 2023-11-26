import { z } from 'zod';

export const BookingQuery = z.object({
    acaraId: z.number().int(),
    kursiId: z.number().int()
});
export type BookingQuery = z.infer<typeof BookingQuery>