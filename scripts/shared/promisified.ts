import cp from "node:child_process";
import { promisify } from "node:util";

export const exec = promisify(cp.exec);
