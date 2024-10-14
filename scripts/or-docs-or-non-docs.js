import cp from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(cp.exec);

const diffRaw = await exec("git diff --name-only HEAD");
const diffFiles = diffRaw.stdout.split("\n").filter(Boolean);

const [docs, nonDocs] = diffFiles.reduce(
	(prev, curr) => {
		const [docs, nonDocs] = prev;

		curr.startsWith("docs/") ? docs.push(curr) : nonDocs.push(curr);

		return prev;
	},
	[[], []],
);

if (docs.length && nonDocs.length) {
	throw new Error(`Shouldn't commit docs and non-docs in the same commit!`);
}
