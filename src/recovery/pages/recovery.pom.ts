import { type Locator, type Page, expect } from "@playwright/test";
import { rootRoute } from "../../ui/types/root-route.ts";

export class RecoveryPom {
	readonly recoveryNavLink: Locator;

	readonly #page: Page;

	constructor(page: Page) {
		this.#page = page;

		this.recoveryNavLink = this.#page.getByRole("link", { name: "recovery" });
	}

	async goto() {
		await this.#page.goto("/");
		await this.recoveryNavLink.click();
		await expect(this.#page).toHaveURL(`/${rootRoute.recovery}`);
	}
}
