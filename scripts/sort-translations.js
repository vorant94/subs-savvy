import { translationFilePaths } from "./shared/config.js";
import {
	readTranslation,
	sortTranslation,
	writeTranslation,
} from "./shared/translation.js";

await Promise.all(
	translationFilePaths.map(async (filePath) => {
		const translation = await readTranslation(filePath);

		const sortedTranslation = sortTranslation(translation);

		await writeTranslation(filePath, sortedTranslation);
	}),
);
