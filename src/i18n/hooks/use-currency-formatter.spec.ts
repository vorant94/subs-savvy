import { type RenderHookResult, renderHook } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrencyFormatter } from "./use-currency-formatter.ts";
import { useCurrency } from "./use-currency.ts";
import { useLanguage } from "./use-language.ts";

vi.mock("./use-currency.ts");
vi.mock("./use-language.ts");

describe("useCurrencyFormatter", () => {
	let renderResult: RenderHookResult<Intl.NumberFormat, void>;
	let hooks: RenderHookResult<Intl.NumberFormat, void>["result"];

	beforeAll(() => {
		vi.mocked(useCurrency).mockReturnValue("USD");
		vi.mocked(useLanguage).mockReturnValue("en-US");
	});

	beforeEach(() => {
		renderResult = renderHook<Intl.NumberFormat, void>(() =>
			useCurrencyFormatter(),
		);

		hooks = renderResult.result;
	});

	it("should format number to currency", () => {
		expect(hooks.current.format(33)).toEqual("$33");
	});

	it("should strip of decimals", () => {
		expect(hooks.current.format(33.33)).toEqual("$33");
	});
});
