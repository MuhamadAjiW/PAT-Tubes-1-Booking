import { z } from 'zod';

export const KursiUpdateRequest = z.object({
    kursi_id: z.number().int(),
    status: z.string().refine(value => ["OPEN", "ON GOING", "BOOKED"].includes(value), {
      message: "Status must be one of 'OPEN', 'ON GOING', 'BOOKED'",
    }),
});
export type KursiUpdateRequest = z.infer<typeof KursiUpdateRequest>