import { MantineProvider } from "@mantine/core";
import { type RenderResult, render, waitFor } from "@testing-library/react";
import type { FC, PropsWithChildren } from "react";
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
	let listItemSpy: MockInstance;

	beforeAll(() => {
		vi.mocked(SubscriptionListItem.type).mockReturnValue(<div />);
		listItemSpy = vi.spyOn(SubscriptionListItem, "type");
	});

	beforeEach(() => {
		screen = render(<SubscriptionList />, { wrapper });
	});

	afterEach(() => {
		vi.clearAllMocks();
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
						expect(listItemSpy).toHaveBeenCalledWith({ subscription }, {}),
					),
				),
			);

			await waitFor(() =>
				expect(screen.queryByText("No Subscriptions")).not.toBeInTheDocument(),
			);
		});
	});

	describe("without data", () => {
		beforeAll(() => {
			vi.mocked(useSubscriptions).mockReturnValue({ ...useSubscriptionsMock });
		});

		it("should show no subscription placeholder instead of list items", async () => {
			expect(listItemSpy).not.toHaveBeenCalled();

			await waitFor(() =>
				expect(screen.queryByText("No Subscriptions")).toBeVisible(),
			);
		});
	});
});

const wrapper: FC<PropsWithChildren> = ({ children }) => {
	return <MantineProvider>{children}</MantineProvider>;
};
