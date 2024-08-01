import { useEffect, useMemo, useState } from "react";
import {
	type SupportedLanguage,
	supportedLanguages,
} from "../types/supported-language.ts";

export function useLanguage(): SupportedLanguage {
	// TODO connect to user settings language once it is available

	const [languageFromBrowser, setLanguageFromBrowser] = useState<
		string | null
	>();
	useEffect(() => setLanguageFromBrowser(navigator.language), []);
	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener(
			"languagechange",
			() => setLanguageFromBrowser(navigator.language),
			{ signal: controller.signal },
		);

		return () => controller.abort();
	});

	return useMemo(
		() =>
			languageFromBrowser && supportedLanguages.includes(languageFromBrowser)
				? (languageFromBrowser as SupportedLanguage)
				: defaultLanguage,
		[languageFromBrowser],
	);
}

const defaultLanguage: SupportedLanguage = "en-US" as const;
