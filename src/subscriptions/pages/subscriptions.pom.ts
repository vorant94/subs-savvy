import type { Locator, Page } from "@playwright/test";
import { CategorySelectCom } from "../../categories/components/category-select.com.ts";
import { InputCom } from "../../ui/components/input.com.ts";
import { SubscriptionUpsertCom } from "../components/subscription-upsert.com";
import type {
	SubscriptionModel,
	UpsertSubscriptionModel,
} from "../models/subscription.model";

export class SubscriptionsPom {
	readonly addSubscriptionButton: Locator;
	readonly noSubscriptionsPlaceholder: Locator;
	readonly namePrefixControl: InputCom;
	readonly clearNamePrefixButton: Locator;

	readonly subscriptionUpsert: SubscriptionUpsertCom;

	readonly categorySelect: CategorySelectCom;

	readonly subscriptionsNavLink: Locator;

	readonly #page: Page;

	constructor(page: Page) {
		this.#page = page;

		this.addSubscriptionButton = this.#page.getByRole("button", {
			name: "add sub",
		});
		this.noSubscriptionsPlaceholder = this.#page.getByText("No Subscriptions");
		this.namePrefixControl = new InputCom(this.#page.getByLabel("name prefix"));
		this.clearNamePrefixButton = this.#page.getByLabel("clear name prefix");

		this.subscriptionUpsert = new SubscriptionUpsertCom(this.#page);

		this.categorySelect = new CategorySelectCom(this.#page);

		this.subscriptionsNavLink = this.#page.getByRole("link", {
			name: "subscriptions",
		});
	}

	async goto() {
		await this.#page.goto("/");
		await this.subscriptionsNavLink.click();
	}

	subscriptionListItem({
		name,
	}: SubscriptionModel | UpsertSubscriptionModel): Locator {
		return this.#page.getByLabel(name);
	}
}
