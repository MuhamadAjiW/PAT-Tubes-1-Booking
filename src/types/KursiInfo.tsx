import { any, z } from 'zod';

export const KursiInfo = z.object({
    kursi_id: z.number().int(),
    acara_id: z.number().int(),
    status: z.any() //ini tipe datanya apa anjir wkwkwkw
});
export type KursiInfo = z.infer<typeof KursiInfo>