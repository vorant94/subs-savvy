import path from "node:path";
import type { TypeOptions } from "i18next";
import { supportedLanguages } from "../../src/features/i18n/model/use-language.ts";
import type { Translation } from "../../src/shared/lib/translation.ts";

export const translationFilePaths = createTranslationFilePaths();

export function sortTranslation(translation: Translation): Translation {
	return (
		Object.keys(translation).toSorted() as Array<keyof Translation>
	).reduce((sorted, key) => {
		sorted[key] = translation[key];

		return sorted;
	}, {} as Translation);
}

function createTranslationFilePaths(
	customNamespaces: ReadonlyArray<string> = [],
): ReadonlyArray<string> {
	const result = [];

	const namespaces = [
		"translation" satisfies TypeOptions["defaultNS"],
		...customNamespaces,
	];

	for (const language of supportedLanguages) {
		for (const namespace of namespaces) {
			const filePath = path.join(
				process.cwd(),
				"public/locales",
				language,
				`${namespace}.json`,
			);

			result.push(filePath);
		}
	}

	return result;
}
