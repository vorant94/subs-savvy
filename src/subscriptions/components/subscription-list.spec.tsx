import { MantineProvider } from "@mantine/core";
import {
	type RenderResult,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../models/subscription.stub.ts";
import { useSubscriptions } from "../stores/subscriptions.store.tsx";
import { SubscriptionList } from "./subscription-list";

vi.mock(import("../stores/subscriptions.store.tsx"));
vi.mock(import("./subscription-list-item.tsx"));

describe("SubscriptionList", () => {
	let screen: RenderResult;

	beforeEach(() => {
		screen = render(<SubscriptionList />, {
			wrapper: ({ children }) => {
				return <MantineProvider>{children}</MantineProvider>;
			},
		});
	});

	it("should render list items instead of no subscription placeholder", async () => {
		const subscriptions = [
			monthlySubscription,
			yearlySubscription,
		] satisfies ReadonlyArray<SubscriptionModel>;

		await Promise.all(
			subscriptions.map((subscription) =>
				waitFor(() =>
					expect(screen.getByTestId(subscription.id)).toBeVisible(),
				),
			),
		);

		await waitFor(() =>
			expect(screen.queryByText("No Subscriptions")).not.toBeInTheDocument(),
		);
	});

	it("should filter out subscription by name", async () => {
		const filteredSubscription = {
			...yearlySubscription,
		} satisfies SubscriptionModel;
		const filteredOutSubscription = {
			...monthlySubscription,
		} satisfies SubscriptionModel;

		fireEvent.change(screen.getByLabelText("Name prefix"), {
			target: { value: "te" },
		});

		await Promise.all([
			waitFor(() =>
				expect(screen.getByTestId(filteredSubscription.id)).toBeVisible(),
			),
			waitFor(() =>
				expect(
					screen.queryByTestId(filteredOutSubscription.id),
				).not.toBeInTheDocument(),
			),
		]);
	});

	describe("without data", () => {
		beforeAll(() => {
			vi.mocked(useSubscriptions).mockReturnValue([]);
		});

		it("should show no subscription placeholder instead of list items", async () => {
			await waitFor(() =>
				expect(screen.queryByText("No Subscriptions")).toBeVisible(),
			);
		});

		it("should show no subscription placeholder instead of list items", async () => {
			await waitFor(() =>
				expect(screen.queryByText("No Subscriptions")).toBeVisible(),
			);
		});

		afterAll(() => {
			vi.mocked(useSubscriptions).mockRestore();
		});
	});
});
