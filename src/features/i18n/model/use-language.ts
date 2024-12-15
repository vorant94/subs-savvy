import { useTranslation } from "react-i18next";

export function useLanguage(): SupportedLanguage {
	// TODO connect to user settings language once it is available

	const { i18n } = useTranslation();

	return i18n.language as SupportedLanguage;
}

export const supportedLanguages = ["en"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: SupportedLanguage = "en" as const;
