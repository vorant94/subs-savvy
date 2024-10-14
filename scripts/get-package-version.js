import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import { z } from "zod";
import { encoding } from "./shared/config.js";

const argsRaw = parseArgs({
	options: {
		package: { type: "string", short: "p" },
	},
});

const argsSchema = z.object({ package: z.string() });

const args = argsSchema.parse(argsRaw.values);

const lockfileJson = await fs.readFile(
	path.join(process.cwd(), "package-lock.json"),
	{ encoding },
);

const lockfile = JSON.parse(lockfileJson);

console.info(lockfile.packages[`node_modules/${args.package}`].version);
