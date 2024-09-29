import { vi } from "vitest";
import type { SupportedLanguage } from "../use-language.ts";

export const useLanguage = vi.fn(
	() => "en-US" as const,
) satisfies () => SupportedLanguage;
