import process from "node:process";
import { exec } from "./utils/promisified.js";

const diffRaw = await exec("git diff --name-only HEAD^");
const diffFiles = diffRaw.stdout.split("\n").filter(Boolean);

const docs = diffFiles.filter((f) => f.startsWith("docs/"));

if (docs.length) {
	process.exit(1);
}
