import { z } from 'zod';

export const KursiUpdateRequest = z.object({
    kursi_id: z.number().int(),
    status: z.string().refine(value => value === null || ["OPEN", "ON GOING", "BOOKED"].includes(value), {
      message: "Status must be null or one of 'OPEN', 'ON GOING', 'BOOKED'",
    }),
});
export type KursiUpdateRequest = z.infer<typeof KursiUpdateRequest>