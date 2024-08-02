import { usePrevious } from "@mantine/hooks";
import { type PropsWithChildren, memo, useEffect } from "react";
import { create } from "zustand";
import { useDefaultLayout } from "../../ui/hooks/use-default-layout.tsx";
import type {
	InsertSubscriptionModel,
	SubscriptionModel,
	UpdateSubscriptionModel,
	UpsertSubscriptionModel,
} from "../models/subscription.model.ts";
import {
	deleteSubscription,
	insertSubscription,
	updateSubscription,
} from "../models/subscription.table.ts";

export function useSubscriptionUpsertMode(): Store["mode"] {
	return useStore(selectMode);
}

export function useSubscriptionUpsertState(): UseSubscriptionUpsertState {
	return useStore(selectState);
}

export type UseSubscriptionUpsertState =
	| {
			mode: "update";
			subscription: SubscriptionModel;
	  }
	| {
			mode: "insert" | null;
	  };

export function useSubscriptionUpsertActions(): Store["actions"] {
	return useStore(selectActions);
}

export const SubscriptionUpsertProvider = memo(
	({ children }: PropsWithChildren) => {
		const { drawer, isDrawerOpened } = useDefaultLayout();
		const prevIsDrawerOpened = usePrevious(isDrawerOpened);

		const { mode, actions } = useStore();
		const prevMode = usePrevious(mode);
		useEffect(() => {
			if (mode !== prevMode) {
				if (mode && !isDrawerOpened) {
					drawer.open();
				}
				if (!mode && isDrawerOpened) {
					drawer.close();
				}
			}

			if (isDrawerOpened !== prevIsDrawerOpened) {
				if (!isDrawerOpened && mode) {
					actions.close();
				}
			}
		}, [
			drawer.close,
			drawer.open,
			isDrawerOpened,
			mode,
			actions.close,
			prevMode,
			prevIsDrawerOpened,
		]);

		return <>{children}</>;
	},
);

const useStore = create<Store>((set, get) => ({
	mode: null,
	subscription: null,
	actions: {
		open(subscription) {
			return set(() => ({
				subscription,
				mode: subscription ? "update" : "insert",
			}));
		},
		close() {
			return set(() => ({
				mode: null,
				subscription: null,
			}));
		},
		async upsert(raw) {
			get().mode === "update"
				? await updateSubscription(raw as UpdateSubscriptionModel)
				: await insertSubscription(raw as InsertSubscriptionModel);

			get().actions.close();
		},
		async delete() {
			if (get().mode !== "update") {
				throw new Error("Nothing to delete in insert mode!");
			}

			await deleteSubscription((get().subscription as SubscriptionModel).id);

			get().actions.close();
		},
	},
}));

interface Store {
	mode: "update" | "insert" | null;
	subscription: SubscriptionModel | null;
	actions: {
		open(subscription?: SubscriptionModel | null): void;
		close(): void;
		upsert(raw: UpsertSubscriptionModel): Promise<void>;
		delete(): Promise<void>;
	};
}

function selectMode({ mode }: Store): Store["mode"] {
	return mode;
}

function selectState({
	subscription,
	mode,
}: Store): UseSubscriptionUpsertState {
	return mode === "update"
		? {
				subscription: subscription as SubscriptionModel,
				mode,
			}
		: {
				mode,
			};
}

function selectActions({ actions }: Store): Store["actions"] {
	return actions;
}
