import { MantineProvider } from "@mantine/core";
import {
	type RenderResult,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useSubscriptions } from "../hooks/use-subscriptions";
import { useSubscriptionsMock } from "../hooks/use-subscriptions.mock.ts";
import {
	monthlySubscription,
	yearlySubscription,
} from "../models/subscription.mock.ts";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { SubscriptionList } from "./subscription-list";
import { SubscriptionListItem } from "./subscription-list-item.tsx";

vi.mock(import("../hooks/use-subscriptions.tsx"));
vi.mock(import("./subscription-list-item.tsx"));

describe("SubscriptionList", () => {
	let screen: RenderResult;

	beforeAll(() => {
		vi.mocked(SubscriptionListItem.type).mockImplementation(
			({ subscription }) => <div data-testid={subscription.name} />,
		);
	});

	beforeEach(() => {
		screen = render(<SubscriptionList />, { wrapper });
	});

	describe("with data", () => {
		beforeAll(() => {
			vi.mocked(useSubscriptions).mockReturnValue({
				...useSubscriptionsMock,
				subscriptions: [monthlySubscription, yearlySubscription],
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
						expect(screen.getByTestId(subscription.name)).toBeVisible(),
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
					expect(screen.getByTestId(filteredSubscription.name)).toBeVisible(),
				),
				waitFor(() =>
					expect(
						screen.queryByTestId(filteredOutSubscription.name),
					).not.toBeInTheDocument(),
				),
			]);
		});
	});

	describe("without data", () => {
		beforeAll(() => {
			vi.mocked(useSubscriptions).mockReturnValue({ ...useSubscriptionsMock });
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
