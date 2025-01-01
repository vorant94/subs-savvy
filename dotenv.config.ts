import process from "node:process";
import dotenv from "dotenv";
import { z } from "zod";

const { error, parsed } = dotenv.config();

export default z
	.object({
		// biome-ignore lint/style/useNamingConvention: env variables have different convention
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		// biome-ignore lint/style/useNamingConvention: env variables have different convention
		CI: z.coerce.boolean().default(false),
	})
	.parse(error ? process.env : parsed);