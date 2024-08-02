import { usePrevious } from "@mantine/hooks";
import { type PropsWithChildren, memo, useEffect } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
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

export function useSubscriptionUpsertState(): SubscriptionUpsertState {
	return useStore(selectState);
}

export type SubscriptionUpsertState =
	| {
			mode: "update";
			subscription: SubscriptionModel;
	  }
	| {
			mode: "insert" | null;
			subscription: null;
	  };

export function useSubscriptionUpsertMode(): SubscriptionUpsertState["mode"] {
	return useStore(selectMode);
}

export function useSubscriptionUpsertActions(): SubscriptionUpsertActions {
	return useStore(selectActions);
}

export interface SubscriptionUpsertActions {
	open(subscription?: SubscriptionModel | null): void;
	close(): void;
	upsert(raw: UpsertSubscriptionModel): Promise<void>;
	delete(): Promise<void>;
}

export const SubscriptionUpsertProvider = memo(
	({ children }: PropsWithChildren) => {
		const { drawer, isDrawerOpened } = useDefaultLayout();
		const prevIsDrawerOpened = usePrevious(isDrawerOpened);

		const { mode, close } = useStore();
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
					close();
				}
			}
		}, [
			drawer.close,
			drawer.open,
			isDrawerOpened,
			mode,
			close,
			prevMode,
			prevIsDrawerOpened,
		]);

		return <>{children}</>;
	},
);

const useStore = create<Store>()(
	devtools(
		(set, get) => ({
			mode: null,
			subscription: null,
			open(subscription) {
				return set(
					subscription
						? {
								subscription,
								mode: "update",
							}
						: {
								subscription: null,
								mode: "insert",
							},
					undefined,
					{ type: "open", subscription },
				);
			},
			close() {
				return set(
					{
						mode: null,
						subscription: null,
					},
					undefined,
					{ type: "close" },
				);
			},
			async upsert(raw) {
				const store = get();

				store.mode === "update"
					? await updateSubscription(raw as UpdateSubscriptionModel)
					: await insertSubscription(raw as InsertSubscriptionModel);

				store.close();
				set({}, undefined, { type: "upsert", raw });
			},
			async delete() {
				const store = get();
				if (store.mode !== "update") {
					throw new Error("Nothing to delete in insert mode!");
				}

				await deleteSubscription(store.subscription.id);

				store.close();
				set({}, undefined, { type: "delete" });
			},
		}),
		{ name: "SubscriptionUpsert", enabled: import.meta.env.DEV },
	),
);

type Store = SubscriptionUpsertState & SubscriptionUpsertActions;

function selectMode({ mode }: Store): SubscriptionUpsertState["mode"] {
	return mode;
}

function selectState({ subscription, mode }: Store): SubscriptionUpsertState {
	return { subscription, mode } as SubscriptionUpsertState;
}

function selectActions({
	open,
	close,
	upsert,
	delete: deleteSubscription,
}: Store): SubscriptionUpsertActions {
	return { open, close, upsert, delete: deleteSubscription };
}
