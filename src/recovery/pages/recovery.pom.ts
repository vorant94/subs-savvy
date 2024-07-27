import type { Locator, Page } from "@playwright/test";

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
	}
}
