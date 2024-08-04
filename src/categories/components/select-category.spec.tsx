import { MantineProvider } from "@mantine/core";
import { type RenderResult, fireEvent, render } from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { categoryMock } from "../models/category.mock.ts";
import type { CategoryModel } from "../models/category.model.ts";
import {
	useCategories,
	useSelectedCategory,
} from "../stores/categories.store.tsx";
import { SelectCategory } from "./select-category.tsx";

vi.mock(import("../stores/categories.store.tsx"));

describe("SelectCategory", () => {
	let screen: RenderResult;
	const selectCategorySpy = vi.fn();

	beforeAll(() => {
		vi.mocked(useCategories).mockReturnValue([categoryMock]);
		vi.mocked(useSelectedCategory).mockReturnValue([null, selectCategorySpy]);
	});

	beforeEach(() => {
		screen = render(<SelectCategory />, { wrapper });
	});

	it("should call selectCategory and close combobox on category selected", () => {
		const categoryToSelect = { ...categoryMock } satisfies CategoryModel;

		fireEvent.click(screen.getByLabelText("select-category"));
		fireEvent.click(
			screen.getByRole("option", { name: categoryToSelect.name }),
		);

		expect(selectCategorySpy).toBeCalledWith(`${categoryToSelect.id}`);
		expect(
			screen.queryByRole("option", { name: categoryToSelect.name }),
		).not.toBeInTheDocument();
	});
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
	return <MantineProvider>{children}</MantineProvider>;
};
