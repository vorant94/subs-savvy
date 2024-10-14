import process from "node:process";
import { translationFilePaths } from "./shared/config.js";
import { readTranslation, sortTranslation } from "./shared/translation.js";

const results = await Promise.allSettled(
	translationFilePaths.map(async (filePath) => {
		const translation = await readTranslation(filePath);
		const translationJson = JSON.stringify(translation, null, "\t");

		const sortedTranslation = sortTranslation(translation);
		const sortedJson = JSON.stringify(sortedTranslation, null, "\t");

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
