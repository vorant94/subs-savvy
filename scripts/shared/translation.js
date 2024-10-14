import fs from "node:fs/promises";
import { EOL } from "node:os";
import path from "node:path";
import process from "node:process";
import { encoding } from "./config.js";

/**
 * read translation
 * @param {string} filePath
 * @returns {Promise<Record<string, string>>}
 */
export async function readTranslation(filePath) {
	const fullFilePath = path.join(process.cwd(), filePath);

	const json = await fs.readFile(fullFilePath, { encoding });

	return JSON.parse(json);
}

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

/**
 * write translation
 * @param {string} filePath
 * @param {Record<string, string>} translation
 * @returns {Promise<void>}
 */
export async function writeTranslation(filePath, translation) {
	const fullFilePath = path.join(process.cwd(), filePath);

	const translationJson = JSON.stringify(translation, null, "\t");

	await fs.writeFile(fullFilePath, translationJson, { encoding });
	await fs.appendFile(fullFilePath, EOL, { encoding });
}
