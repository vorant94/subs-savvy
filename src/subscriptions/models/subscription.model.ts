import { z } from 'zod';

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  // Coercion is needed because <input/> with type="number" still returns string as a value
  price: z.coerce.number(),
  icon: z.string().min(1),
  description: z.string().nullable().optional(),
});
export type SubscriptionModel = z.infer<typeof subscriptionSchema>;

export const insertSubscriptionSchema = subscriptionSchema.omit({ id: true });
export type InsertSubscriptionModel = z.infer<typeof insertSubscriptionSchema>;
