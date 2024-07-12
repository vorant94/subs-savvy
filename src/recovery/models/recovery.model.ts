import { z } from 'zod';
import { subscriptionSchema } from '../../subscriptions/models/subscription.model.ts';

// TODO add support for exporting with categories as well
export const recoverySchema = z.object({
  dbVersion: z.number(),
  subscriptions: z.array(
    subscriptionSchema.omit({
      id: true,
    }),
  ),
});
export type RecoveryModel = z.infer<typeof recoverySchema>;
