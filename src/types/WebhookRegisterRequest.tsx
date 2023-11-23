import { z } from 'zod';

export const WebhookRegisterRequest = z.object({
    eventName: z.string(),
    endpoint: z.string().url(),
});
export type WebhookRegisterRequest = z.infer<typeof WebhookRegisterRequest>