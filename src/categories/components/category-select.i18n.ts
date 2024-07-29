export const categorySelectI18n = {
	"select-category": "select-category",
} as const;

export type CategorySelectI18n = Record<
	keyof typeof categorySelectI18n,
	string
>;

export const categorySelectEn = {
	"select-category": "Select Category",
} as const satisfies CategorySelectI18n;
