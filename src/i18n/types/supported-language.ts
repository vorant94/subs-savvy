export const supportedLanguages = ["en-US"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];
