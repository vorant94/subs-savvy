import {
	type RenderHookResult,
	act,
	renderHook,
	waitFor,
} from "@testing-library/react";
import {
	type MockInstance,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { categoryMock } from "../../categories/models/category.mock.ts";
import type { CategoryModel } from "../../categories/models/category.model.ts";
import { dbVersion } from "../../db/globals/db.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../../subscriptions/models/subscription.mock.ts";
import type { SubscriptionModel } from "../../subscriptions/models/subscription.model.ts";
import type { RecoveryModel } from "../models/recovery.model.ts";
import * as recoveryTable from "../models/recovery.table.ts";
import {
	type RecoveryImportActions,
	type RecoveryImportState,
	useRecoveryImport,
	useRecoveryImportActions,
	useStore,
} from "./recovery-import.store.ts";

vi.mock(import("../models/recovery.table.ts"));

describe("recovery-import.store", () => {
	let renderResult: RenderHookResult<HooksCombined, void>;
	let hooks: RenderHookResult<HooksCombined, void>["result"];
	const initialState = useStore.getState();
	const recovery = {
		dbVersion,
		subscriptions: [monthlySubscription, yearlySubscription],
		categories: [categoryMock],
	} as const satisfies RecoveryModel;

	beforeEach(() => {
		renderResult = renderHook<HooksCombined, void>(() => ({
			state: useRecoveryImport(),
			actions: useRecoveryImportActions(),
		}));

		hooks = renderResult.result;
	});

	afterEach(() => {
		useStore.setState(initialState, true);
	});

	it("should initially be in 'upload-recovery' stage", () => {
		expect(hooks.current.state.stage).toEqual("upload-recovery");
		expect(hooks.current.state.subscriptions).toEqual([]);
		expect(hooks.current.state.categories).toEqual([]);
	});

	describe("upload-recovery <=> submit-categories", () => {
		it("should go next", () => {
			act(() => hooks.current.actions.goNextFromUploadRecovery(recovery));

			expect(hooks.current.state.stage).toEqual("submit-categories");
			expect(hooks.current.state.subscriptions).toEqual(recovery.subscriptions);
			expect(hooks.current.state.categories).toEqual(recovery.categories);
		});

		it("should go next and extract categories from subscriptions if they are missing separately", () => {
			const recovery = {
				dbVersion,
				subscriptions: [monthlySubscription, yearlySubscription],
				categories: [],
			} as const satisfies RecoveryModel;

			act(() => hooks.current.actions.goNextFromUploadRecovery(recovery));

			expect(hooks.current.state.stage).toEqual("submit-categories");
			expect(hooks.current.state.subscriptions).toEqual(recovery.subscriptions);
			expect(hooks.current.state.categories).toEqual([categoryMock]);
		});

		it("should go prev and reset subscriptions and categories", () => {
			act(() => hooks.current.actions.goNextFromUploadRecovery(recovery));
			act(() => hooks.current.actions.goPrevFromSubmitCategories());

			expect(hooks.current.state.stage).toEqual("upload-recovery");
			expect(hooks.current.state.subscriptions).toEqual([]);
			expect(hooks.current.state.categories).toEqual([]);
		});
	});

	describe("submit-categories <=> submit-subscriptions", () => {
		beforeEach(() => {
			act(() => hooks.current.actions.goNextFromUploadRecovery(recovery));
		});

		it("should go next", () => {
			act(() =>
				hooks.current.actions.goNextFromSubmitCategories(recovery.categories),
			);

			expect(hooks.current.state.stage).toEqual("submit-subscriptions");
			expect(hooks.current.state.subscriptions).toEqual(recovery.subscriptions);
			expect(hooks.current.state.categories).toEqual(recovery.categories);
		});

		it("should go next and adjust categories if they were changed", () => {
			const category = {
				...categoryMock,
				name: "adjusted",
			} satisfies CategoryModel;
			const subscriptions = [
				{ ...monthlySubscription, category },
				yearlySubscription,
			] satisfies Array<SubscriptionModel>;

			act(() => hooks.current.actions.goNextFromSubmitCategories([category]));

			expect(hooks.current.state.stage).toEqual("submit-subscriptions");
			expect(hooks.current.state.subscriptions).toEqual(subscriptions);
			expect(hooks.current.state.categories).toEqual([category]);
		});

		it("should go prev", () => {
			act(() =>
				hooks.current.actions.goNextFromSubmitCategories(recovery.categories),
			);
			act(() =>
				hooks.current.actions.goPrevFromSubmitSubscriptions(
					recovery.subscriptions,
				),
			);

			expect(hooks.current.state.stage).toEqual("submit-categories");
			expect(hooks.current.state.subscriptions).toEqual(recovery.subscriptions);
			expect(hooks.current.state.categories).toEqual(recovery.categories);
		});

		it("should go prev and adjust subscriptions if they were changed", () => {
			const subscriptions = [
				{ ...monthlySubscription, name: "adjusted" },
				yearlySubscription,
			] satisfies Array<SubscriptionModel>;

			act(() =>
				hooks.current.actions.goNextFromSubmitCategories(recovery.categories),
			);
			act(() =>
				hooks.current.actions.goPrevFromSubmitSubscriptions(subscriptions),
			);

			expect(hooks.current.state.stage).toEqual("submit-categories");
			expect(hooks.current.state.subscriptions).toEqual(subscriptions);
			expect(hooks.current.state.categories).toEqual(recovery.categories);
		});
	});

	describe("submit-subscriptions => completed", () => {
		let upsertCategoriesAndSubscriptionsSpy: MockInstance;

		beforeAll(() => {
			upsertCategoriesAndSubscriptionsSpy = vi.spyOn(
				recoveryTable,
				"upsertCategoriesAndSubscriptions",
			);
		});

		beforeEach(() => {
			act(() => hooks.current.actions.goNextFromUploadRecovery(recovery));
			act(() =>
				hooks.current.actions.goNextFromSubmitCategories(recovery.categories),
			);
		});

		it("should go next", async () => {
			await act(() =>
				hooks.current.actions.goNextFromSubmitSubscriptions(
					recovery.subscriptions,
				),
			);

			// TODO test intermediate "processing" stage

			await waitFor(() =>
				expect(upsertCategoriesAndSubscriptionsSpy).toBeCalledWith(
					recovery.categories,
					recovery.subscriptions,
				),
			);
			await waitFor(() =>
				expect(hooks.current.state.stage).toEqual("completed"),
			);
		});

		it.todo("should fail gracefully");
	});

	it("should reset", () => {
		act(() => hooks.current.actions.goNextFromUploadRecovery(recovery));
		act(() =>
			hooks.current.actions.goNextFromSubmitCategories(recovery.categories),
		);

		act(() => hooks.current.actions.reset());

		expect(hooks.current.state.stage).toEqual("upload-recovery");
		expect(hooks.current.state.subscriptions).toEqual([]);
		expect(hooks.current.state.categories).toEqual([]);
	});
});

interface HooksCombined {
	state: RecoveryImportState;
	actions: RecoveryImportActions;
}
