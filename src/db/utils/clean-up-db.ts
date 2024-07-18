import { db } from "../globals/db.ts";

// utility function for tests only
export async function cleanUpDb(): Promise<void> {
	await db.transaction("rw", db.subscriptions, db.categories, async () => {
		await db.subscriptions.clear();
		await db.categories.clear();
	});
}
