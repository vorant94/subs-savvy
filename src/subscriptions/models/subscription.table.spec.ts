import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { categoryStub } from "../../categories/models/category.stub.ts";
import { db } from "../../db/globals/db.ts";
import { cleanUpDb } from "../../db/utils/clean-up-db.ts";
import { populateDb } from "../../db/utils/populate-db.ts";
import type { SubscriptionModel } from "./subscription.model.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "./subscription.stub.ts";
import {
	deleteSubscription,
	findSubscriptions,
	insertSubscription,
	updateSubscription,
} from "./subscription.table.ts";

describe("with data", () => {
	beforeEach(
		async () => await populateDb([monthlySubscription, yearlySubscription]),
	);

	afterEach(async () => await cleanUpDb());

	it("should find subscriptions sorted by price", async () => {
		const subscriptions = [
			yearlySubscription,
			monthlySubscription,
		] satisfies ReadonlyArray<SubscriptionModel>;

		expect(await findSubscriptions()).toEqual(subscriptions);
	});

	it("should throw if there are subscriptions with non-existing categories", async () => {
		await db.categories.delete(categoryStub.id);

		expect(async () => await findSubscriptions()).rejects.toThrowError(
			/Category with id 5 not found!/,
		);
	});

	it("should update subscription", async () => {
		const subscriptionToUpdate = {
			...monthlySubscription,
			price: 10,
		} satisfies SubscriptionModel;

		await updateSubscription(subscriptionToUpdate);

		const { category: _, ...expected } = {
			...subscriptionToUpdate,
			categoryId: subscriptionToUpdate.category.id,
		};
		expect(await db.subscriptions.get(subscriptionToUpdate.id)).toEqual(
			expected,
		);
	});

	it(`should throw on update if subscription category doesn't exist`, async () => {
		const subscriptionToUpdate = {
			...monthlySubscription,
			price: 10,
			category: {
				...monthlySubscription.category,
				id: 7,
			},
		} satisfies SubscriptionModel;

		await expect(
			async () => await updateSubscription(subscriptionToUpdate),
		).rejects.toThrowError(/Category with id 7 not found!/);
	});

	it("should delete subscription", async () => {
		const subscription = {
			...monthlySubscription,
		} satisfies SubscriptionModel;

		await deleteSubscription(subscription.id);

		expect(await db.subscriptions.get(subscription.id)).toBeFalsy();
	});
});

describe("without data", () => {
	beforeEach(async () => await populateDb(undefined, [categoryStub]));

	afterEach(async () => await cleanUpDb());

	it("should insert subscription", async () => {
		const { id: _, ...subscriptionToInsert } = {
			...monthlySubscription,
		} satisfies SubscriptionModel;

		const { id } = await insertSubscription(subscriptionToInsert);

		const { category: __, ...expected } = {
			id,
			...subscriptionToInsert,
			categoryId: subscriptionToInsert.category.id,
		};
		expect(await db.subscriptions.get(id)).toEqual(expected);
	});

	it(`should throw on insert if subscription category doesn't exist`, async () => {
		const { id: _, ...subscriptionToInsert } = {
			...monthlySubscription,
			category: {
				...monthlySubscription.category,
				id: 7,
			},
		} satisfies SubscriptionModel;

		await expect(
			async () => await insertSubscription(subscriptionToInsert),
		).rejects.toThrowError(/Category with id 7 not found!/);
	});
});
