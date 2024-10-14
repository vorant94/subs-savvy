export const translationFilePaths = ["public/locales/en-US/translation.json"];

/**
 * sort translation
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
