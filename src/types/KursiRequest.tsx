import { z } from 'zod';

export const KursiRequest = z.object({
    kursi_id: z.number().int(),
});
export type KursiRequest = z.infer<typeof KursiRequest>