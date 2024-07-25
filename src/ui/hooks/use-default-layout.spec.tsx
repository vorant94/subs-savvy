import { type RenderHookResult, act, renderHook } from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import type { NavigateFunction } from "react-router/dist/lib/hooks";
import { beforeEach, describe, expect, it } from "vitest";
import {
	DefaultLayoutProvider,
	type UseDefaultLayout,
	useDefaultLayout,
} from "./use-default-layout.tsx";

describe("useDefaultLayout", () => {
	let renderResult: RenderHookResult<HooksCombined, void>;
	let hooks: RenderHookResult<HooksCombined, void>["result"];

	beforeEach(() => {
		renderResult = renderHook<HooksCombined, void>(
			() => ({
				navigate: useNavigate(),
				defaultLayout: useDefaultLayout(),
			}),
			{
				wrapper,
			},
		);

		hooks = renderResult.result;
	});

	it("should close nav on router navigation", () => {
		act(() => hooks.current.defaultLayout.nav.open());
		act(() => hooks.current.navigate("/foo"));

		expect(hooks.current.defaultLayout.isNavOpened).toBeFalsy();
	});
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<MemoryRouter>
			<DefaultLayoutProvider>{children}</DefaultLayoutProvider>
		</MemoryRouter>
	);
};

interface HooksCombined {
	navigate: NavigateFunction;
	defaultLayout: UseDefaultLayout;
}
