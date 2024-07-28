import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db/globals/db.ts";
import { cleanUpDb } from "../../db/utils/clean-up-db.ts";
import { populateDb } from "../../db/utils/populate-db.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../../subscriptions/models/subscription.mock.ts";
import { categoryMock } from "./category.mock.ts";
import type { CategoryModel } from "./category.model.ts";
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
		const categories = [categoryMock] satisfies ReadonlyArray<CategoryModel>;

		expect(await findCategories()).toEqual(categories);
	});

	it("should update category", async () => {
		const categoryToUpdate = {
			...categoryMock,
			name: "Car",
		} satisfies CategoryModel;

		await updateCategory(categoryToUpdate);

		expect(await db.categories.get(categoryToUpdate.id)).toEqual(
			categoryToUpdate,
		);
	});

	it("should delete category and unlink all linked to it subscriptions", async () => {
		const category = { ...categoryMock } satisfies CategoryModel;

		await deleteCategory(category.id);

		expect(await db.categories.get(category.id)).toBeFalsy();
		expect(
			(await db.subscriptions.where({ categoryId: category.id }).toArray())
				.length,
		).toEqual(0);
	});
});

describe("without data", () => {
	afterEach(async () => await cleanUpDb());

	it("should insert category", async () => {
		const { id: _, ...categoryToInsert } = {
			...categoryMock,
		} satisfies CategoryModel;

		const { id } = await insertCategory(categoryToInsert);

		expect(await db.categories.get(id)).toEqual({ ...categoryToInsert, id });
	});
});
