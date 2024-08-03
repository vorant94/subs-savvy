import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { CategoryNotFound } from "../../categories/models/category.table.ts";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import type { RecoveryModel } from "../models/recovery.model.ts";
import { upsertCategoriesAndSubscriptions } from "../models/recovery.table.ts";

export function useRecoveryImport(): RecoveryImportState {
	return useStore(useShallow(selectState));
}

export function useRecoveryImportStage(): RecoveryImportStateStage {
	return useStore(selectStage);
}

export const recoveryImportStateStages = [
	"upload-recovery",
	"submit-categories",
	"submit-subscriptions",
	"failed",
	"completed",
] as const;
export type RecoveryImportStateStage =
	(typeof recoveryImportStateStages)[number];

export interface RecoveryImportState {
	stage: RecoveryImportStateStage;
	categories: Array<CategoryModel>;
	subscriptions: Array<SubscriptionModel>;
}

export function useRecoveryImportActions(): RecoveryImportActions {
	return useStore(useShallow(selectActions));
}

export interface RecoveryImportActions {
	goNextFromUploadRecovery(recovery: RecoveryModel): void;
	goPrevFromSubmitCategories(): void;
	goNextFromSubmitCategories(categories: Array<CategoryModel>): void;
	goPrevFromSubmitSubscriptions(subscriptions: Array<SubscriptionModel>): void;
	goNextFromSubmitSubscriptions(
		subscriptions: Array<SubscriptionModel>,
	): Promise<void>;
	reset(): void;
}

export class IllegalTransitionError extends Error {
	constructor(
		from: RecoveryImportState["stage"],
		to: RecoveryImportState["stage"],
	) {
		super(`Illegal transition from "${from}" to "${to}"`);
	}
}

/**
 * @internal should not be used outside of its own unit tests
 */
export const useStore = create<Store>()(
	devtools(
		(set, get) => ({
			stage: "upload-recovery",
			categories: [],
			subscriptions: [],
			goNextFromUploadRecovery({ categories, subscriptions }) {
				const state = get();
				if (state.stage !== "upload-recovery") {
					throw new IllegalTransitionError(state.stage, "submit-categories");
				}

				const categoryIds = new Set(categories.map(({ id }) => id));
				for (const subscription of subscriptions) {
					if (!subscription.category) {
						continue;
					}

					if (categoryIds.has(subscription.category.id)) {
						continue;
					}

					categories.push(subscription.category);
					categoryIds.add(subscription.category.id);
				}

				set(
					() => ({ stage: "submit-categories", categories, subscriptions }),
					undefined,
					"goNextFromUploadRecovery",
				);
			},
			goPrevFromSubmitCategories() {
				const state = get();
				if (state.stage !== "submit-categories") {
					throw new IllegalTransitionError(state.stage, "upload-recovery");
				}

				set(
					() => ({
						stage: "upload-recovery",
						categories: [],
						subscriptions: [],
					}),
					undefined,
					"goPrevFromSubmitCategories",
				);
			},
			goNextFromSubmitCategories(categories) {
				const state = get();
				if (state.stage !== "submit-categories") {
					throw new IllegalTransitionError(state.stage, "submit-subscriptions");
				}

				const categoryIdToCategory = new Map(
					categories.map((category) => [category.id, category]),
				);
				const subscriptions = state.subscriptions.map((subscription) => {
					if (!subscription.category) {
						return subscription;
					}

					if (!categoryIdToCategory.has(subscription.category.id)) {
						throw new CategoryNotFound(subscription.category.id);
					}

					subscription.category = categoryIdToCategory.get(
						subscription.category.id,
					);
					return subscription;
				});

				set(
					() => ({
						stage: "submit-subscriptions",
						categories,
						subscriptions,
					}),
					undefined,
					"goNextFromSubmitCategories",
				);
			},
			goPrevFromSubmitSubscriptions(subscriptions) {
				const state = get();
				if (state.stage !== "submit-subscriptions") {
					throw new IllegalTransitionError(state.stage, "submit-categories");
				}

				set(
					() => ({
						stage: "submit-categories",
						subscriptions,
					}),
					undefined,
					"goPrevFromSubmitSubscriptions",
				);
			},
			async goNextFromSubmitSubscriptions(
				subscriptions: Array<SubscriptionModel>,
			) {
				const state = get();
				if (state.stage !== "submit-subscriptions") {
					throw new IllegalTransitionError(state.stage, "submit-subscriptions");
				}

				try {
					await upsertCategoriesAndSubscriptions(
						state.categories,
						subscriptions,
					);

					set(
						() => ({ stage: "completed" }),
						undefined,
						"goNextFromSubmitSubscriptions",
					);
				} catch (_e) {
					set(
						() => ({ stage: "failed" }),
						undefined,
						"goNextFromSubmitSubscriptions",
					);
				}
			},
			reset() {
				set(
					() => ({
						stage: "upload-recovery",
						categories: [],
						subscriptions: [],
					}),
					undefined,
					"reset",
				);
			},
		}),
		{ name: "RecoveryImport", enabled: import.meta.env.DEV },
	),
);

type Store = RecoveryImportState & RecoveryImportActions;

function selectState({
	stage,
	categories,
	subscriptions,
}: Store): RecoveryImportState {
	return { stage, categories, subscriptions };
}

function selectStage({ stage }: Store): RecoveryImportStateStage {
	return stage;
}

function selectActions({
	goNextFromUploadRecovery,
	goPrevFromSubmitCategories,
	goNextFromSubmitCategories,
	goPrevFromSubmitSubscriptions,
	goNextFromSubmitSubscriptions,
	reset,
}: Store): RecoveryImportActions {
	return {
		goNextFromUploadRecovery,
		goPrevFromSubmitCategories,
		goNextFromSubmitCategories,
		goPrevFromSubmitSubscriptions,
		goNextFromSubmitSubscriptions,
		reset,
	};
}
