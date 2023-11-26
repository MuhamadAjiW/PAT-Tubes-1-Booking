import { z } from 'zod';

export const WebhookData = z.object({
    webhook_id: z.number().int(),
    event_name: z.string(),
    client_id: z.number().int(),
    endpoint: z.string()
});
export type WebhookData = z.infer<typeof WebhookData>

export const WebhookCoreData = z.object({
    event_name: z.string(),
    endpoint: z.string()
});
export type WebhookCoreData = z.infer<typeof WebhookCoreData>