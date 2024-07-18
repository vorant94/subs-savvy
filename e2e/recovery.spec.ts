import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { type Page, expect, test } from "@playwright/test";
import { recoverySchema } from "../src/recovery/models/recovery.model.ts";
import { RecoveryExportPom } from "../src/recovery/pages/recovery-export.pom.ts";
import { RecoveryImportPom } from "../src/recovery/pages/recovery-import.pom.ts";
import { RecoveryPom } from "../src/recovery/pages/recovery.pom.ts";
import { recoveryRoute } from "../src/recovery/types/recovery-route.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../src/subscriptions/models/subscription.mock.ts";
import type { SubscriptionModel } from "../src/subscriptions/models/subscription.model.ts";
import { rootRoute } from "../src/ui/types/root-route.ts";

test.describe("recovery", () => {
	test("should redirect from recovery url to recovery import", async ({
		page,
	}) => {
		const pom = new RecoveryPom(page);

		await pom.goto();

		await expect(page).toHaveURL(
			`/${rootRoute.recovery}/${recoveryRoute.import}`,
		);
	});

	test("should export all subscriptions as a JSON file", async ({ page }) => {
		const pom = new RecoveryExportPom(page);
		const subscriptionsToExport = [
			monthlySubscription,
			yearlySubscription,
		] satisfies ReadonlyArray<SubscriptionModel>;

		await pom.goto();
		await populateDb(page, subscriptionsToExport);

		await pom.selectAllSubscriptions.fill(true);
		const [download] = await Promise.all([
			page.waitForEvent("download"),
			pom.exportButton.click(),
		]);
		const recoveryString = await fs.readFile(await download.path(), {
			encoding: "utf-8",
		});
		const exportedRecovery = recoverySchema.parse(JSON.parse(recoveryString));

		const areAllSubscriptionsExported = subscriptionsToExport.every(
			(subscriptionToExport) =>
				!!exportedRecovery.subscriptions.find(
					(exportedSubscription) =>
						exportedSubscription.name === subscriptionToExport.name,
				),
		);
		expect(areAllSubscriptionsExported).toBeTruthy();
	});

	test("should import all subscriptions from a JSON file", async ({ page }) => {
		const pom = new RecoveryImportPom(page);
		const filePathToImport = path.join(
			process.cwd(),
			"e2e/assets/subscriptions.json",
		);
		const recoveryStringToImport = await fs.readFile(filePathToImport, {
			encoding: "utf-8",
		});
		const recoveryToImport = recoverySchema.parse(
			JSON.parse(recoveryStringToImport),
		);

		await pom.goto();
		const [fileChooser] = await Promise.all([
			page.waitForEvent("filechooser"),
			pom.chooseFileButton.click(),
		]);
		await fileChooser.setFiles(filePathToImport);
		await pom.importButton.click();
		const importedSubscriptions = await page.evaluate(
			async () => await window.db.subscriptions.toArray(),
		);

		const areAllSubscriptionsImported = recoveryToImport.subscriptions.every(
			(subscriptionToImport) =>
				!!importedSubscriptions.find(
					(importedSubscription) =>
						importedSubscription.name === subscriptionToImport.name,
				),
		);
		expect(areAllSubscriptionsImported).toBeTruthy();
	});
});

async function populateDb(
	page: Page,
	subscriptions: ReadonlyArray<SubscriptionModel>,
): Promise<void> {
	await page.evaluate(async (subscriptions) => {
		await window.db.transaction(
			"rw",
			window.db.subscriptions,
			window.db.categories,
			async () => {
				const subscriptionPuts: Array<Promise<unknown>> = [];
				const categoryPuts: Array<Promise<unknown>> = [];

				for (const { category, ...subscription } of subscriptions) {
					subscriptionPuts.push(
						window.db.subscriptions.put({
							...subscription,
							categoryId: category?.id,
						}),
					);

					if (category) {
						categoryPuts.push(window.db.categories.put(category));
					}
				}

				await Promise.all([...subscriptionPuts, ...categoryPuts]);
			},
		);
	}, subscriptions);
}
