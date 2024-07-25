import type { CategoryModel } from "../../categories/models/category.model.ts";
import { _getCategory } from "../../categories/models/category.table.ts";
import { db } from "../../db/globals/db.ts";
import {
	type InsertSubscriptionModel,
	type SubscriptionModel,
	type UpdateSubscriptionModel,
	insertSubscriptionSchema,
	subscriptionSchema,
	updateSubscriptionSchema,
} from "./subscription.model.ts";

export function findSubscriptions(): Promise<ReadonlyArray<SubscriptionModel>> {
	return db.transaction("r", db.subscriptions, db.categories, async () => {
		const raws = await db.subscriptions.orderBy("price").reverse().toArray();

		return await Promise.all(
			raws.map(async ({ categoryId, ...raw }) => {
				let category: CategoryModel | null = null;
				if (categoryId) {
					category = await _getCategory(categoryId);
				}

				return subscriptionSchema.parse({ ...raw, category });
			}),
		);
	});
}

export function insertSubscription(
	raw: InsertSubscriptionModel,
): Promise<SubscriptionModel> {
	return db.transaction("rw", db.subscriptions, db.categories, () =>
		_insertSubscription(raw),
	);
}

export function insertSubscriptions(
	raw: Array<InsertSubscriptionModel>,
): Promise<Array<SubscriptionModel>> {
	return db.transaction("rw", db.subscriptions, db.categories, () =>
		Promise.all(raw.map((raw) => _insertSubscription(raw))),
	);
}

export function updateSubscription(
	raw: UpdateSubscriptionModel,
): Promise<SubscriptionModel> {
	return db.transaction("rw", db.subscriptions, db.categories, async () => {
		const { id, category, ...rest } = updateSubscriptionSchema.parse(raw);

		if (category) {
			await _getCategory(category.id);
		}

		await db.subscriptions.update(id, {
			...rest,
			categoryId: category?.id ?? null,
		});

		return _getSubscription(id);
	});
}

export function deleteSubscription(id: number): Promise<void> {
	return db.transaction("rw", db.subscriptions, async () => {
		await db.subscriptions.delete(id);
	});
}

async function _getSubscription(id: number): Promise<SubscriptionModel> {
	const raw = await db.subscriptions.get(id);
	if (!raw) {
		throw new SubscriptionNotFound(id);
	}

	let category: CategoryModel | null = null;
	if (raw.categoryId) {
		category = await _getCategory(raw.categoryId);
	}

	return subscriptionSchema.parse({ ...raw, category });
}

async function _insertSubscription(
	raw: InsertSubscriptionModel,
): Promise<SubscriptionModel> {
	const { category, ...rest } = insertSubscriptionSchema.parse(raw);

	if (category) {
		await _getCategory(category.id);
	}

	const id = await db.subscriptions.add({ ...rest, categoryId: category?.id });
	return _getSubscription(id);
}

export class SubscriptionNotFound extends Error {
	constructor(subscriptionId: number) {
		super(`Subscription with id ${subscriptionId} not found!`);
	}
}
