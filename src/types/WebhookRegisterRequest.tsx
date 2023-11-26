import { z } from 'zod';

export const WebhookRegisterRequest = z.object({
    eventName: z.string(),
    endpoint: z.string(),
});
export type WebhookRegisterRequest = z.infer<typeof WebhookRegisterRequest>