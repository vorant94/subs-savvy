import fs from "fs-extra";
import { sortTranslation, translationFilePaths } from "./shared/translation.js";

await Promise.all(
	translationFilePaths.map(async (filePath) => {
		const translation = await fs.readJSON(filePath);

		const sortedTranslation = sortTranslation(translation);

		await fs.writeJSON(filePath, sortedTranslation, {
			spaces: "\t",
		});
	}),
);
