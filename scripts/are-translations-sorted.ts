import console from "node:console";
import process from "node:process";
import fse from "fs-extra";
import { sortTranslation, translationFilePaths } from "./shared/translation.js";

const results = await Promise.allSettled(
	translationFilePaths.map(async (filePath) => {
		const translation = await fse.readJSON(filePath);
		const translationJson = JSON.stringify(translation);

		const sortedTranslation = sortTranslation(translation);
		const sortedJson = JSON.stringify(sortedTranslation);

		if (translationJson !== sortedJson) {
			throw new Error(`Translation of ${filePath} isn't sorted!`);
		}
	}),
);

const rejectedResults = results.filter(
	(r): r is PromiseRejectedResult => r.status === "rejected",
);
if (rejectedResults.length) {
	for (const result of rejectedResults) {
		console.error(result.reason);
	}

	process.exit(1);
}
