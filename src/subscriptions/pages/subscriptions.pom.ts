import type { Locator, Page } from "@playwright/test";
import { SelectCategoryCom } from "../../categories/components/select-category.com.ts";
import { InputCom } from "../../ui/components/input.com.ts";
import { rootRoute } from "../../ui/types/root-route.ts";
import { UpsertSubscriptionCom } from "../components/upsert-subscription.com.ts";
import type {
	SubscriptionModel,
	UpsertSubscriptionModel,
} from "../models/subscription.model";

export class SubscriptionsPom {
	readonly addSubscriptionButton: Locator;
	readonly noSubscriptionsPlaceholder: Locator;
	readonly namePrefixControl: InputCom;
	readonly clearNamePrefixButton: Locator;

	readonly subscriptionUpsert: UpsertSubscriptionCom;

	readonly categorySelect: SelectCategoryCom;

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

		this.subscriptionUpsert = new UpsertSubscriptionCom(this.#page);

		this.categorySelect = new SelectCategoryCom(this.#page);

		this.subscriptionsNavLink = this.#page.getByRole("link", {
			name: "subscriptions",
		});
	}

	async goto() {
		await this.#page.goto("/");
		await this.subscriptionsNavLink.click();
		await this.#page.waitForURL(`/${rootRoute.subscriptions}`);
	}

	subscriptionListItem({
		name,
	}: SubscriptionModel | UpsertSubscriptionModel): Locator {
		return this.#page.getByLabel(name);
	}
}
