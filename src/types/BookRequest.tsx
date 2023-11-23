import { z } from 'zod';

export const BookRequest = z.object({
    acaraId: z.number().int(),
    kursiId: z.number().int(),
    userId: z.number().int()
});
export type BookRequest = z.infer<typeof BookRequest>