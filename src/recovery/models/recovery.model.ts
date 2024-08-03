import { z } from "zod";
import { categorySchema } from "../../categories/models/category.model.ts";
import { subscriptionSchema } from "../../subscriptions/models/subscription.model.ts";

export const recoverySchema = z.object({
	dbVersion: z.number(),
	subscriptions: z.array(subscriptionSchema),
	categories: z.array(categorySchema),
});
export type RecoveryModel = z.infer<typeof recoverySchema>;
