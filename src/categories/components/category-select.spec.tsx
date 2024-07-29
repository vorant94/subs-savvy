import { MantineProvider } from "@mantine/core";
import { type RenderResult, fireEvent, render } from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import {
	type MockInstance,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { useSubscriptionsMock } from "../../subscriptions/hooks/use-subscriptions.mock.ts";
import { useSubscriptions } from "../../subscriptions/hooks/use-subscriptions.tsx";
import { categoryMock } from "../models/category.mock.ts";
import type { CategoryModel } from "../models/category.model.ts";
import { categorySelectI18n } from "./category-select.i18n.ts";
import { CategorySelect } from "./category-select.tsx";

vi.mock(import("../../subscriptions/hooks/use-subscriptions.tsx"));

describe("CategorySelect", () => {
	let screen: RenderResult;
	let selectCategorySpy: MockInstance;

	beforeAll(() => {
		selectCategorySpy = vi.spyOn(useSubscriptionsMock, "selectCategory");

		vi.mocked(useSubscriptions).mockReturnValue({
			...useSubscriptionsMock,
			categories: [categoryMock],
		});
	});

	beforeEach(() => {
		screen = render(<CategorySelect />, { wrapper });
	});

	it("should call selectCategory and close combobox on category selected", () => {
		const categoryToSelect = { ...categoryMock } satisfies CategoryModel;

		fireEvent.click(
			screen.getByLabelText(categorySelectI18n["select-category"]),
		);
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
