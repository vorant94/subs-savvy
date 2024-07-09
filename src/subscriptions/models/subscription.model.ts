import { categorySchema } from '@/categories/models/category.model.ts';
import { z } from 'zod';
import { subscriptionCyclePeriods } from '../types/subscription-cycle-period.ts';
import { subscriptionIcons } from '../types/subscription-icon.ts';

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  icon: z.enum(subscriptionIcons),
  // TODO add different currency support
  price: z.number(),
  // despite dexie support for dates without coercion it is still needed because of recovery via JSON
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().nullable().optional(),
  cycle: z.object({
    each: z.number(),
    period: z.enum(subscriptionCyclePeriods),
  }),
  category: categorySchema.nullable().optional(),
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
