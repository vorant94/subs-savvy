import { MantineProvider } from "@mantine/core";
import { type RenderResult, fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CategoryModel } from "../models/category.model.ts";
import { categoryStub } from "../models/category.stub.ts";
import { selectCategorySpy } from "../stores/__mocks__/categories.store.tsx";
import { SelectCategory } from "./select-category.tsx";

vi.mock(import("../stores/categories.store.tsx"));

describe("SelectCategory", () => {
	let screen: RenderResult;

	beforeEach(() => {
		screen = render(<SelectCategory />, {
			wrapper: ({ children }) => {
				return <MantineProvider>{children}</MantineProvider>;
			},
		});
	});

	it("should call selectCategory and close combobox on category selected", () => {
		const categoryToSelect = { ...categoryStub } satisfies CategoryModel;

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
