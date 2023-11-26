import { z } from 'zod';

export const WebhookClient = z.object({
    client_id: z.number().int(),
    ip: z.string(),
    token: z.string()
});
export type WebhookClient = z.infer<typeof WebhookClient>