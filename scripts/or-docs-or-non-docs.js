import { parseArgs } from "node:util";
import { z } from "zod";
import { exec } from "./shared/promisified.js";

const argsRaw = parseArgs({
	options: {
		target: { type: "string", short: "t" },
	},
});

const argsSchema = z.object({ target: z.string().nullable().default("HEAD") });

const args = argsSchema.parse(argsRaw.values);

const diffRaw = await exec(`git diff --name-only ${args.target}`);
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
	throw new Error(
		`There shouldn't be docs and non-docs changes in the same commit/pull request!`,
	);
}
