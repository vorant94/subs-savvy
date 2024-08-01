import { useEffect, useState } from "react";
import {
	type SupportedLanguage,
	supportedLanguages,
} from "../types/supported-language.ts";

export function useLanguage(): SupportedLanguage {
	const [language, setLanguage] = useState<SupportedLanguage>("en-US");

	// TODO connect to user settings language once it is available

	useEffect(() => {
		if (supportedLanguages.includes(navigator.language)) {
			setLanguage(navigator.language as SupportedLanguage);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener(
			"languagechange",
			() => {
				if (supportedLanguages.includes(navigator.language)) {
					setLanguage(navigator.language as SupportedLanguage);
				}
			},
			{ signal: controller.signal },
		);

		return () => controller.abort();
	});

	return language;
}
