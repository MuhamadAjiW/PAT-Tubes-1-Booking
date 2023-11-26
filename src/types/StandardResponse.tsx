import { any, z } from 'zod';

export const StandardResponse = z.object({
    message: z.string(),
    valid: z.boolean(),
    data: z.any().optional() //ini tipe datanya apa anjir wkwkwkw
});
export type StandardResponse = z.infer<typeof StandardResponse>