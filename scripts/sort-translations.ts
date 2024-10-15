import fse from "fs-extra";
import { sortTranslation, translationFilePaths } from "./shared/translation.js";

await Promise.all(
	translationFilePaths.map(async (filePath) => {
		const translation = await fse.readJSON(filePath);

		const sortedTranslation = sortTranslation(translation);

		await fse.writeJSON(filePath, sortedTranslation, {
			spaces: "\t",
		});
	}),
);
