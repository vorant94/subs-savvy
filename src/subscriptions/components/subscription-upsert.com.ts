import type { Locator, Page } from "@playwright/test";
import { DatePickerInputCom } from "../../ui/components/date-picker-input.com";
import { InputCom } from "../../ui/components/input.com";
import { SelectCom } from "../../ui/components/select.com";
import { createDatePickerInputAriaLabels } from "../../ui/utils/create-date-picker-input-aria-labels";
import type { UpsertSubscriptionModel } from "../models/subscription.model.ts";
import {
	type SubscriptionCyclePeriod,
	subscriptionCyclePeriodToLabel,
} from "../types/subscription-cycle-period";
import {
	type SubscriptionIcon,
	subscriptionIconToLabel,
} from "../types/subscription-icon";

export class SubscriptionUpsertCom {
	insertButton: Locator;
	updateButton: Locator;
	deleteButton: Locator;

	nameControl: InputCom;
	descriptionControl: InputCom;
	iconControl: SelectCom<SubscriptionIcon>;
	priceControl: InputCom;
	startedAtControl: DatePickerInputCom;
	endedAtControl: DatePickerInputCom;
	eachControl: InputCom;
	periodControl: SelectCom<SubscriptionCyclePeriod>;
	categoryControl: SelectCom;

	constructor(private readonly page: Page) {
		this.insertButton = this.page.getByRole("button", { name: "insert" });
		this.updateButton = this.page.getByRole("button", { name: "update" });
		this.deleteButton = this.page.getByRole("button", { name: "delete" });

		this.nameControl = new InputCom(
			this.page.getByLabel("Name", { exact: true }),
		);
		this.descriptionControl = new InputCom(this.page.getByLabel("description"));
		this.iconControl = new SelectCom(
			this.page.getByLabel("icon"),
			subscriptionIconToLabel,
		);
		this.priceControl = new InputCom(this.page.getByLabel("price"));
		this.startedAtControl = new DatePickerInputCom(
			this.page.getByLabel("started at"),
			DatePickerInputCom.mapAriaLabelsToLocators(
				this.page,
				createDatePickerInputAriaLabels("started at"),
			),
			this.page,
		);
		this.endedAtControl = new DatePickerInputCom(
			this.page.getByLabel("ended at"),
			DatePickerInputCom.mapAriaLabelsToLocators(
				this.page,
				createDatePickerInputAriaLabels("ended at"),
			),
			this.page,
		);
		this.eachControl = new InputCom(this.page.getByLabel("each"));
		this.periodControl = new SelectCom(
			this.page.getByLabel("period"),
			subscriptionCyclePeriodToLabel,
		);
		this.categoryControl = new SelectCom(this.page.getByLabel("category"));
	}

	async fill(subscription: UpsertSubscriptionModel): Promise<void> {
		await this.nameControl.fill(subscription.name);

		if (subscription.description) {
			await this.descriptionControl.fill(subscription.description);
		}

		await this.iconControl.fillWithValue(subscription.icon);
		await this.priceControl.fill(subscription.price);
		await this.startedAtControl.fill(subscription.startedAt);

		if (subscription.endedAt) {
			await this.endedAtControl.fill(subscription.endedAt);
		}

		await this.eachControl.fill(subscription.cycle.each);
		await this.periodControl.fillWithValue(subscription.cycle.period);

		if (subscription.category) {
			await this.categoryControl.fillWithLabel(subscription.category.name);
		}
	}
}
