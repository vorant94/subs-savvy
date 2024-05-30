import { z } from 'zod';

export const subscriptionSchema = z.object({
  // Coercion is needed because <input/> with type="number" still returns string as a value
  id: z.coerce.number(),
  name: z.string().min(1),
  price: z.coerce.number(),
  icon: z.string().min(1),
  description: z.string().nullable().optional(),
  // Preprocessing is needed because <input/> with type="date" returns empty string as a value and it is not a valid date
  startedAt: z.preprocess(
    (value) => (value === '' ? null : value),
    z.coerce.date().nullable().optional(),
  ),
  endedAt: z.preprocess(
    (value) => (value === '' ? null : value),
    z.coerce.date().nullable().optional(),
  ),
});
export type SubscriptionModel = z.infer<typeof subscriptionSchema>;

export const insertSubscriptionSchema = subscriptionSchema.omit({ id: true });
export type InsertSubscriptionModel = z.infer<typeof insertSubscriptionSchema>;

export const updateSubscriptionSchema = subscriptionSchema;
export type UpdateSubscriptionModel = z.infer<typeof updateSubscriptionSchema>;

export type UpsertSubscriptionModel =
  | InsertSubscriptionModel
  | UpdateSubscriptionModel;
