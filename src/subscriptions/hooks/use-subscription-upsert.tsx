import { usePrevious } from "@mantine/hooks";
import {
	type Dispatch,
	type PropsWithChildren,
	type Reducer,
	createContext,
	memo,
	useContext,
	useEffect,
	useReducer,
} from "react";
import { useDefaultLayout } from "../../ui/hooks/use-default-layout.tsx";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { useSubscriptionUpsertMock } from "./use-subscription-upsert.mock.ts";

export function useSubscriptionUpsert() {
	return useContext(subscriptionUpsertContext);
}

export interface UseSubscriptionUpsert {
	state: SubscriptionUpsertState;
	dispatch: Dispatch<SubscriptionUpsertAction>;
}

export type SubscriptionUpsertState =
	| {
			subscription: SubscriptionModel;
			mode: "update";
	  }
	| {
			mode: "insert";
	  }
	| {
			subscription: null;
			mode: null;
	  };

export interface SubscriptionUpsertOpenAction {
	type: "open";
	subscription?: SubscriptionModel | null;
}

export interface SubscriptionUpsertCloseAction {
	type: "close";
}

export type SubscriptionUpsertAction =
	| SubscriptionUpsertOpenAction
	| SubscriptionUpsertCloseAction;

export const SubscriptionUpsertProvider = memo(
	({ children }: PropsWithChildren) => {
		const layout = useDefaultLayout();
		const prevLayout = usePrevious(layout);

		const [state, dispatch] = useReducer<
			Reducer<SubscriptionUpsertState, SubscriptionUpsertAction>
		>((_, action) => {
			switch (action.type) {
				case "open": {
					return action.subscription
						? {
								subscription: action.subscription,
								mode: "update",
							}
						: {
								mode: "insert",
							};
				}
				case "close": {
					return stateDefaults;
				}
			}
		}, stateDefaults);
		const prevState = usePrevious(state);

		useEffect(() => {
			if (state.mode !== prevState?.mode) {
				if (state.mode && !layout.isDrawerOpened) {
					layout.drawer.open();
				}
				if (!state.mode && layout.isDrawerOpened) {
					layout.drawer.close();
				}
			}

			if (layout.isDrawerOpened !== prevLayout?.isDrawerOpened) {
				if (!layout.isDrawerOpened && state.mode) {
					dispatch({ type: "close" });
				}
			}
		}, [
			layout.drawer.close,
			layout.drawer.open,
			layout.isDrawerOpened,
			state.mode,
			prevState?.mode,
			prevLayout?.isDrawerOpened,
		]);

		return (
			<subscriptionUpsertContext.Provider value={{ state, dispatch }}>
				{children}
			</subscriptionUpsertContext.Provider>
		);
	},
);

const subscriptionUpsertContext = createContext<UseSubscriptionUpsert>(
	useSubscriptionUpsertMock,
);

const stateDefaults: SubscriptionUpsertState = {
	mode: null,
	subscription: null,
};
