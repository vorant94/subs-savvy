import { MantineProvider } from "@mantine/core";
import {
	type RenderResult,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
	monthlySubscription,
	yearlySubscription,
} from "../models/subscription.mock.ts";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { useSubscriptions } from "../stores/subscriptions.store.tsx";
import { SubscriptionList } from "./subscription-list";
import { SubscriptionListItemMock } from "./subscription-list-item.mock.tsx";
import { SubscriptionListItem } from "./subscription-list-item.tsx";

vi.mock(import("../stores/subscriptions.store.tsx"));
vi.mock(import("./subscription-list-item.tsx"));

describe("SubscriptionList", () => {
	let screen: RenderResult;

	beforeAll(() => {
		vi.mocked(SubscriptionListItem.type).mockImplementation(
			SubscriptionListItemMock,
		);
	});

	beforeEach(() => {
		screen = render(<SubscriptionList />, { wrapper });
	});

	describe("with data", () => {
		beforeAll(() => {
			vi.mocked(useSubscriptions).mockReturnValue([
				monthlySubscription,
				yearlySubscription,
			]);
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
	});
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
	return <MantineProvider>{children}</MantineProvider>;
};
