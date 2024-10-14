import console from "node:console";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import fs from "fs-extra";
import { z } from "zod";

const argsRaw = parseArgs({
	options: {
		package: { type: "string", short: "p" },
	},
});

const argsSchema = z.object({ package: z.string() });

const args = argsSchema.parse(argsRaw.values);

const lockfile = await fs.readJSON(
	path.join(process.cwd(), "package-lock.json"),
);

console.info(lockfile.packages[`node_modules/${args.package}`].version);
