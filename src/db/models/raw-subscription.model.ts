import type { CategoryModel } from "../../categories/models/category.model.ts";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";

export interface RawSubscriptionModel
	extends Omit<SubscriptionModel, "category"> {
	categoryId?: CategoryModel["id"] | null;
}
