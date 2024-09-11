import { vi } from "vitest";
import type { CategoryModel } from "../category.model.ts";
import { categoryStub } from "../category.stub.ts";

export const findCategories = vi.fn(async () => [
	categoryStub,
]) satisfies () => Promise<ReadonlyArray<CategoryModel>>;
