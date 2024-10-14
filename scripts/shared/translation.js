import path from "node:path";

export const translationFilePaths = createTranslationFilePaths(
	["en-US"],
	["translation"],
);

/**
 * @param {Record<string, string>} translation
 * @returns {Record<string, string>}
 */
export function sortTranslation(translation) {
	return Object.keys(translation)
		.toSorted()
		.reduce((prev, curr) => {
			prev[curr] = translation[curr];

			return prev;
		}, {});
}

/**
 * @param {Array<string>} locales
 * @param {Array<string>} namespaces
 * @returns {Array<string>}
 */
function createTranslationFilePaths(locales, namespaces) {
	const result = [];

	for (const locale of locales) {
		for (const namespace of namespaces) {
			const filePath = path.join(
				process.cwd(),
				"public/locales",
				locale,
				`${namespace}.json`,
			);

			result.push(filePath);
		}
	}

	return result;
}
