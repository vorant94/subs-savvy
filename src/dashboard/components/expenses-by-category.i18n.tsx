export const expensesByCategoryI18n = {
	"no-category": "no-category",
	total: "total",
	"expenses-by-category": "expenses-by-category",
} as const;

export type ExpensesByCategoryI18n = Record<
	keyof typeof expensesByCategoryI18n,
	string
>;

export const expensesByCategoryEn = {
	"no-category": "No Category",
	total: "Total",
	"expenses-by-category": "Expenses by Category",
} as const satisfies ExpensesByCategoryI18n;
