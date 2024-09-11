import type { CategoryModel } from "./category.model.ts";

export const categoryStub = {
	id: 5,
	name: "Basics",
	color: "#000000",
} as const satisfies CategoryModel;
