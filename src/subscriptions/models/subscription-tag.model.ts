import { z } from 'zod';

export const subscriptionTagSchema = z.object({
  subscriptionId: z.number(),
  tagId: z.number(),
});
export type SubscriptionTagModel = z.infer<typeof subscriptionTagSchema>;

export type UpsertSubscriptionTagModel = z.infer<typeof subscriptionTagSchema>;
