import { z } from 'zod';

export const AcaraRequest = z.object({
    nama_acara: z.string(),
});
export type AcaraRequest = z.infer<typeof AcaraRequest>