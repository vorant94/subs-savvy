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
		it("startedAtYear < year", () => {
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

		it("startedAtYear = year", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price * 10);
		});

		it("year < startedAtYear", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt).add(1, "year").toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(0);
		});

		it("startedAtYear < endedAtYear < year", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.subtract(2, "year")
					.toDate(),
				endedAt: dayjs(monthlySubscription.startedAt)
					.subtract(1, "year")
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(0);
		});

		it("startedAtYear < year = endedAtYear", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.subtract(1, "year")
					.set("month", 2)
					.toDate(),
				endedAt: dayjs(monthlySubscription.startedAt).set("month", 6).toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price * 6);
		});

		it("startedAtYear < year < endedAtYear", () => {
			const subscription = {
				...monthlySubscription,
				startedAt: dayjs(monthlySubscription.startedAt)
					.subtract(1, "year")
					.toDate(),
				endedAt: dayjs(monthlySubscription.startedAt).add(1, "year").toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price * 12);
		});

		it("each = 2 && startedAtYear < year", () => {
			const subscription = {
				...twoMonthlySubscription,
				startedAt: dayjs(twoMonthlySubscription.startedAt)
					.subtract(1, "year")
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price * 6);
		});

		it("each = 2 && startedAtYear = year", () => {
			const subscription = {
				...twoMonthlySubscription,
				startedAt: dayjs(twoMonthlySubscription.startedAt)
					.set("month", 2)
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price * 5);
		});

		it("each = 2 && year = endedAtYear", () => {
			const subscription = {
				...twoMonthlySubscription,
				startedAt: dayjs(twoMonthlySubscription.startedAt)
					.subtract(1, "year")
					.set("month", 2)
					.toDate(),
				endedAt: dayjs(monthlySubscription.startedAt).set("month", 6).toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price * 3);
		});
	});

	describe("yearly", () => {
		it("startedAtYear < year", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt)
					.subtract(1, "year")
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price);
		});

		it("startedAtYear = year", () => {
			const subscription = {
				...yearlySubscription,
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price);
		});

		it("year < startedAtYear", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt).add(1, "year").toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(0);
		});

		it("startedAtYear < endedAtYear < year", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt)
					.subtract(2, "year")
					.toDate(),
				endedAt: dayjs(yearlySubscription.startedAt)
					.subtract(1, "year")
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(0);
		});

		it("startedAtYear < year = endedAtYear", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt)
					.subtract(2, "year")
					.toDate(),
				endedAt: dayjs(yearlySubscription.startedAt).toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(0);
		});

		it("startedAtYear < year < endedAtYear", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt)
					.subtract(1, "year")
					.toDate(),
				endedAt: dayjs(yearlySubscription.startedAt).add(1, "year").toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price);
		});

		it("startedAtYear = year < endedAtYear", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt).toDate(),
				endedAt: dayjs(yearlySubscription.startedAt).add(1, "year").toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price);
		});

		it("year < startedAtYear < endedAtYear", () => {
			const subscription = {
				...yearlySubscription,
				startedAt: dayjs(yearlySubscription.startedAt).add(1, "year").toDate(),
				endedAt: dayjs(yearlySubscription.startedAt).add(2, "year").toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(0);
		});

		it("each = 2 && && startedAtYear % year = 1", () => {
			const subscription = {
				...twoYearlySubscription,
				startedAt: dayjs(twoYearlySubscription.startedAt)
					.subtract(1, "year")
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(0);
		});

		it("each = 2 && startedAtYear % year = 0", () => {
			const subscription = {
				...twoYearlySubscription,
				startedAt: dayjs(twoYearlySubscription.startedAt)
					.subtract(2, "year")
					.toDate(),
			} satisfies SubscriptionModel;

			expect(
				calculateSubscriptionPriceForYear(subscription, startOfYear),
			).toEqual(subscription.price);
		});
	});
});
