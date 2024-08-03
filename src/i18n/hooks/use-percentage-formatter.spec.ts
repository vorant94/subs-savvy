import { type RenderHookResult, renderHook } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguage } from "./use-language.ts";
import { usePercentageFormatter } from "./use-percentage-formatter.ts";

vi.mock("./use-language.ts");

describe("useCurrencyFormatter", () => {
	let renderResult: RenderHookResult<Intl.NumberFormat, void>;
	let hooks: RenderHookResult<Intl.NumberFormat, void>["result"];

	beforeAll(() => {
		vi.mocked(useLanguage).mockReturnValue("en-US");
	});

	beforeEach(() => {
		renderResult = renderHook<Intl.NumberFormat, void>(() =>
			usePercentageFormatter(),
		);

		hooks = renderResult.result;
	});

	it("should format number to percent", () => {
		expect(hooks.current.format(0.33)).toEqual("33%");
	});
});
