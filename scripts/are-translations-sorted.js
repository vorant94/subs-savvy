import path from "node:path";
import process from "node:process";
import fs from "fs-extra";
import { sortTranslation, translationFilePaths } from "./shared/translation.js";

const results = await Promise.allSettled(
	translationFilePaths.map(async (filePath) => {
		const fullFilePath = path.join(process.cwd(), filePath);

		const translation = await fs.readJSON(fullFilePath);
		const translationJson = JSON.stringify(translation);

		const sortedTranslation = sortTranslation(translation);
		const sortedJson = JSON.stringify(sortedTranslation);

		if (translationJson !== sortedJson) {
			throw new Error(`Translation of ${filePath} isn't sorted!`);
		}
	}),
);

/**
 * rejected results
 * @type {Array<PromiseRejectedResult>}
 */
const rejectedResults = results.filter((r) => r.status === "rejected");
if (rejectedResults.length) {
	for (const result of rejectedResults) {
		console.error(result.reason);
	}

	process.exit(1);
}
