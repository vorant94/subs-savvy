import { vi } from "vitest";
import type { SubscriptionModel } from "../../models/subscription.model.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../../models/subscription.stub.ts";

export const useSubscriptions = vi.fn(() => [
	monthlySubscription,
	yearlySubscription,
]) satisfies () => ReadonlyArray<SubscriptionModel>;
