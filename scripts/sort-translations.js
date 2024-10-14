import path from "node:path";
import process from "node:process";
import fs from "fs-extra";
import { sortTranslation, translationFilePaths } from "./shared/translation.js";

await Promise.all(
	translationFilePaths.map(async (filePath) => {
		const fullFilePath = path.join(process.cwd(), filePath);

		const translation = await fs.readJSON(fullFilePath);

		const sortedTranslation = sortTranslation(translation);

		await fs.writeJSON(fullFilePath, sortedTranslation, {
			spaces: "\t",
		});
	}),
);
