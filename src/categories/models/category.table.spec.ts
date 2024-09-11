import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db/globals/db.ts";
import { cleanUpDb } from "../../db/utils/clean-up-db.ts";
import { populateDb } from "../../db/utils/populate-db.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../../subscriptions/models/subscription.stub.ts";
import type { CategoryModel } from "./category.model.ts";
import { categoryStub } from "./category.stub.ts";
import {
	deleteCategory,
	findCategories,
	insertCategory,
	updateCategory,
} from "./category.table.ts";

describe("with data", () => {
	beforeEach(
		async () => await populateDb([monthlySubscription, yearlySubscription]),
	);

	afterEach(async () => await cleanUpDb());

	it("should find categories", async () => {
		const categories = [categoryStub] satisfies ReadonlyArray<CategoryModel>;

		expect(await findCategories()).toEqual(categories);
	});

	it("should update category", async () => {
		const categoryToUpdate = {
			...categoryStub,
			name: "Car",
		} satisfies CategoryModel;

		await updateCategory(categoryToUpdate);

		expect(await db.categories.get(categoryToUpdate.id)).toEqual(
			categoryToUpdate,
		);
	});

	it("should delete category and unlink all linked to it subscriptions", async () => {
		const categoryToDelete = { ...categoryStub } satisfies CategoryModel;

		await deleteCategory(categoryToDelete.id);

		expect(await db.categories.get(categoryToDelete.id)).toBeFalsy();
		expect(
			(
				await db.subscriptions
					.where({ categoryId: categoryToDelete.id })
					.toArray()
			).length,
		).toEqual(0);
	});
});

describe("without data", () => {
	afterEach(async () => await cleanUpDb());

	it("should insert category", async () => {
		const { id: _, ...categoryToInsert } = {
			...categoryStub,
		} satisfies CategoryModel;

		const { id } = await insertCategory(categoryToInsert);

		expect(await db.categories.get(id)).toEqual({ ...categoryToInsert, id });
	});
});
