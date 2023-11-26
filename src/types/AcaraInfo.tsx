import { z } from 'zod';

export const AcaraInfo = z.object({
    acara_id: z.number().int(),
    nama_acara: z.string()
});
export type AcaraInfo = z.infer<typeof AcaraInfo>