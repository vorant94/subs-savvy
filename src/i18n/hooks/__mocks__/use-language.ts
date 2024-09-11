import { vi } from "vitest";
import type { SupportedLanguage } from "../../types/supported-language.ts";

export const useLanguage = vi.fn(
	() => "en-US" as const,
) satisfies () => SupportedLanguage;
