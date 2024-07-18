import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import {
	monthlySubscription,
	twoMonthlySubscription,
	twoYearlySubscription,
	yearlySubscription,
} from "../models/subscription.mock.ts";
import type { SubscriptionModel } from "../models/subscription.model.ts";
import { calculateSubscriptionPriceForYear } from "./calculate-subscription-price-for-year.ts";

describe("calculateSubscriptionPriceForYear", () => {
	const startOfYear = dayjs(new Date()).startOf("year").toDate();

	describe("monthly", () => {
		it.todo("startedAtMonth < month && startedAtYear < year", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.subtract(1, "year")
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 3).toDate(),
				),
			).toEqual(subscription.price * 12);
		});

		it.todo("startedAtMonth < month && startedAtYear = year", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 3).toDate(),
				),
			).toEqual(subscription.price * 9);
		});

		it.todo("startedAtMonth = month && startedAtYear = year", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 2).toDate(),
				),
			).toEqual(subscription.price * 10);
		});

		it.todo("month < startedAtMonth && startedAtYear = year", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 1).toDate(),
				),
			).toEqual(subscription.price * 10);
		});

		it.todo("month < startedAtMonth && year < startedAtYear", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.add(1, "year")
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 1).toDate(),
				),
			).toEqual(0);
		});

		it.todo(
			"startedAtMonth < endedAtMonth < month && startedAtYear < endedAtYear < year",
			() => {
				const subscription = {
					...monthlySubscription,
					startedAt: dayjs(monthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(monthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 6)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 9).toDate(),
					),
				).toEqual(0);
			},
		);

		it.todo(
			"startedAtMonth < endedAtMonth < month && startedAtYear < year = endedAtYear",
			() => {
				const subscription = {
					...monthlySubscription,
					startedAt: dayjs(monthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(monthlySubscription.startedAt)
						.set("month", 6)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 9).toDate(),
					),
				).toEqual(subscription.price * 4);
			},
		);

		it.todo(
			"startedAtMonth < month = endedAtMonth && startedAtYear < year = endedAtYear",
			() => {
				const subscription = {
					...monthlySubscription,
					startedAt: dayjs(monthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(monthlySubscription.startedAt)
						.set("month", 9)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 9).toDate(),
					),
				).toEqual(subscription.price * 7);
			},
		);

		it.todo(
			"startedAtMonth < month < endedAtMonth && startedAtYear < year = endedAtYear",
			() => {
				const subscription = {
					...monthlySubscription,
					startedAt: dayjs(monthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(monthlySubscription.startedAt)
						.set("month", 9)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 6).toDate(),
					),
				).toEqual(subscription.price * 7);
			},
		);

		it.todo(
			"startedAtMonth < month < endedAtMonth && startedAtYear < year < endedAtYear",
			() => {
				const subscription = {
					...monthlySubscription,
					startedAt: dayjs(monthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(monthlySubscription.startedAt)
						.add(1, "year")
						.set("month", 9)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 6).toDate(),
					),
				).toEqual(subscription.price * 12);
			},
		);

		it.todo(
			"startedAtMonth < endedAtMonth < month && startedAtYear < year < endedAtYear",
			() => {
				const subscription = {
					...monthlySubscription,
					startedAt: dayjs(monthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(monthlySubscription.startedAt)
						.add(1, "year")
						.set("month", 6)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 9).toDate(),
					),
				).toEqual(subscription.price * 12);
			},
		);

		it.todo(
			"each = 2 && startedAtMonth % month = 0 && startedAtYear < year",
			() => {
				const subscription = {
					...twoMonthlySubscription,
					startedAt: dayjs(twoMonthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 4).toDate(),
					),
				).toEqual(subscription.price * 6);
			},
		);

		it.todo(
			"each = 2 && startedAtMonth % month = 1 && startedAtYear < year",
			() => {
				const subscription = {
					...twoMonthlySubscription,
					startedAt: dayjs(twoMonthlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 3).toDate(),
					),
				).toEqual(subscription.price * 6);
			},
		);
	});

	describe("yearly", () => {
		it.todo("startedAtMonth < month && startedAtYear < year", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt)
					.subtract(1, "year")
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 3).toDate(),
				),
			).toEqual(subscription.price);
		});

		it.todo("startedAtMonth < month && startedAtYear = year", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt).set("month", 2).toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 3).toDate(),
				),
			).toEqual(subscription.price);
		});

		it.todo("startedAtMonth = month && startedAtYear = year", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt).set("month", 2).toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 2).toDate(),
				),
			).toEqual(subscription.price);
		});

		it.todo("startedAtMonth = month && startedAtYear < year", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt)
					.subtract(1, "year")
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 2).toDate(),
				),
			).toEqual(subscription.price);
		});

		it.todo("month < startedAtMonth && startedAtYear = year", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt).set("month", 4).toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 2).toDate(),
				),
			).toEqual(subscription.price);
		});

		it.todo("month < startedAtMonth && year < startedAtYear", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt)
					.add(1, "year")
					.set("month", 4)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(
					subscription,
					dayjs(startOfYear).set("month", 2).toDate(),
				),
			).toEqual(0);
		});

		it.todo(
			"startedAtMonth < endedAtMonth < month && startedAtYear < endedAtYear < year",
			() => {
				const subscription = {
					...yearlySubscription,
					startedAt: dayjs(yearlySubscription.startedAt)
						.subtract(2, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(yearlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 4)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 6).toDate(),
					),
				).toEqual(0);
			},
		);

		it.todo(
			"startedAtMonth < endedAtMonth < month && startedAtYear < year = endedAtYear",
			() => {
				const subscription = {
					...yearlySubscription,
					startedAt: dayjs(yearlySubscription.startedAt)
						.subtract(2, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(yearlySubscription.startedAt).set("month", 4).toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 6).toDate(),
					),
				).toEqual(0);
			},
		);

		it.todo(
			"startedAtMonth < month = endedAtMonth && startedAtYear < year = endedAtYear",
			() => {
				const subscription = {
					...yearlySubscription,
					startedAt: dayjs(yearlySubscription.startedAt)
						.subtract(2, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(yearlySubscription.startedAt).set("month", 4).toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 4).toDate(),
					),
				).toEqual(0);
			},
		);

		it.todo(
			"startedAtMonth < month = endedAtMonth && startedAtYear = year < endedAtYear",
			() => {
				const subscription = {
					...yearlySubscription,
					startedAt: dayjs(yearlySubscription.startedAt)
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(yearlySubscription.startedAt)
						.add(1, "year")
						.set("month", 4)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 4).toDate(),
					),
				).toEqual(subscription.price);
			},
		);

		it.todo(
			"startedAtMonth = month < endedAtMonth && startedAtYear < year < endedAtYear",
			() => {
				const subscription = {
					...yearlySubscription,
					startedAt: dayjs(yearlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(yearlySubscription.startedAt)
						.add(1, "year")
						.set("month", 4)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 2).toDate(),
					),
				).toEqual(subscription.price);
			},
		);

		it.todo(
			"startedAtMonth = month < endedAtMonth && year < startedAtYear < endedAtYear",
			() => {
				const subscription = {
					...yearlySubscription,
					startedAt: dayjs(yearlySubscription.startedAt)
						.add(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(yearlySubscription.startedAt)
						.add(2, "year")
						.set("month", 4)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 2).toDate(),
					),
				).toEqual(0);
			},
		);

		it.todo(
			"month < startedAtMonth < endedAtMonth && year < startedAtYear < endedAtYear",
			() => {
				const subscription = {
					...yearlySubscription,
					startedAt: dayjs(yearlySubscription.startedAt)
						.add(1, "year")
						.set("month", 2)
						.toDate(),
					endedAt: dayjs(yearlySubscription.startedAt)
						.add(2, "year")
						.set("month", 4)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 1).toDate(),
					),
				).toEqual(0);
			},
		);

		it.todo(
			"each = 2 && startedAtMonth = month && startedAtYear % year = 1",
			() => {
				const subscription = {
					...twoYearlySubscription,
					startedAt: dayjs(twoYearlySubscription.startedAt)
						.subtract(1, "year")
						.set("month", 2)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 2).toDate(),
					),
				).toEqual(0);
			},
		);

		it.todo(
			"each = 2 && startedAtMonth = month && startedAtYear % year = 0",
			() => {
				const subscription = {
					...twoYearlySubscription,
					startedAt: dayjs(twoYearlySubscription.startedAt)
						.subtract(2, "year")
						.set("month", 2)
						.toDate(),
				} satisfies SubscriptionModel;

				expect(
					calculateSubscriptionPriceForYear(
						subscription,
						dayjs(startOfYear).set("month", 2).toDate(),
					),
				).toEqual(subscription.price);
			},
		);
	});
});
