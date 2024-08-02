import { type RenderHookResult, act, renderHook } from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import {
	DefaultLayoutProvider,
	type UseDefaultLayout,
	useDefaultLayout,
} from "../../ui/hooks/use-default-layout.tsx";
import {
	SubscriptionUpsertProvider,
	useSubscriptionUpsertActions,
	useSubscriptionUpsertMode,
} from "./subscription-upsert.store.tsx";

describe("useSubscriptionUpsert", () => {
	let renderResult: RenderHookResult<HooksCombined, void>;
	let hooks: RenderHookResult<HooksCombined, void>["result"];

	beforeEach(() => {
		renderResult = renderHook<HooksCombined, void>(
			() => ({
				mode: useSubscriptionUpsertMode(),
				actions: useSubscriptionUpsertActions(),
				defaultLayout: useDefaultLayout(),
			}),
			{
				wrapper,
			},
		);

		hooks = renderResult.result;
	});

	it("should open/close drawer on upsert open/close", () => {
		act(() => hooks.current.actions.open());
		expect(hooks.current.defaultLayout.isDrawerOpened).toBeTruthy();

		act(() => hooks.current.actions.close());
		expect(hooks.current.defaultLayout.isDrawerOpened).toBeFalsy();
	});

	it("should close upsert on drawer close", () => {
		act(() => hooks.current.actions.open());
		expect(hooks.current.defaultLayout.isDrawerOpened).toBeTruthy();

		act(() => hooks.current.defaultLayout.drawer.close());
		expect(hooks.current.mode).toBeFalsy();
	});

	it(`shouldn't open upsert on drawer open`, () => {
		act(() => hooks.current.defaultLayout.drawer.open());
		expect(hooks.current.mode).toBeFalsy();
	});
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<BrowserRouter>
			<DefaultLayoutProvider>
				<SubscriptionUpsertProvider>{children}</SubscriptionUpsertProvider>
			</DefaultLayoutProvider>
		</BrowserRouter>
	);
};

interface HooksCombined {
	mode: ReturnType<typeof useSubscriptionUpsertMode>;
	actions: ReturnType<typeof useSubscriptionUpsertActions>;
	defaultLayout: UseDefaultLayout;
}
