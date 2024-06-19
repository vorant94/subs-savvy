import { z } from 'zod';

export const subscriptionTagSchema = z.object({
  subscriptionId: z.number(),
  tagId: z.number(),
});
export type SubscriptionTagModel = z.infer<typeof subscriptionTagSchema>;

export const upsertSubscriptionTagSchema = subscriptionTagSchema.omit({});
export type UpsertSubscriptionTagModel = z.infer<
  typeof upsertSubscriptionTagSchema
>;
