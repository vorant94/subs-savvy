import { tagSchema } from '@/tags/models/tag.model.ts';
import { z } from 'zod';
import { subscriptionCyclePeriods } from '../types/subscription-cycle-period.ts';
import { subscriptionIcons } from '../types/subscription-icon.tsx';

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  icon: z.enum(subscriptionIcons),
  // TODO add different currency support
  price: z.number(),
  startedAt: z.date(),
  endedAt: z.date().nullable().optional(),
  cycle: z.object({
    each: z.number(),
    period: z.enum(subscriptionCyclePeriods),
  }),
  tags: z.array(tagSchema),
});
export type SubscriptionModel = z.infer<typeof subscriptionSchema>;

export const insertSubscriptionSchema = subscriptionSchema.omit({
  id: true,
});
export type InsertSubscriptionModel = z.infer<typeof insertSubscriptionSchema>;

export const updateSubscriptionSchema = subscriptionSchema.omit({});
export type UpdateSubscriptionModel = z.infer<typeof updateSubscriptionSchema>;

export type UpsertSubscriptionModel =
  | InsertSubscriptionModel
  | UpdateSubscriptionModel;

// TODO add support for exporting with tags as well
export const exportedSubscriptionSchema = subscriptionSchema.omit({
  id: true,
  tags: true,
});
export type ExportedSubscriptionModel = z.infer<
  typeof exportedSubscriptionSchema
>;
