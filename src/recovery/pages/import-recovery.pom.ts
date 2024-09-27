import { type Locator, type Page, expect } from "@playwright/test";
import { rootRoute } from "../../ui/types/root-route.ts";
import { recoveryRoute } from "../types/recovery-route.ts";

export class ImportRecoveryPom {
	readonly recoveryNavLink: Locator;
	readonly importTab: Locator;

	readonly chooseFileButton: Locator;
	readonly submitButton: Locator;

	readonly #page: Page;

	constructor(page: Page) {
		this.#page = page;

		this.recoveryNavLink = this.#page.getByRole("link", { name: "recovery" });
		this.importTab = this.#page.getByRole("tab", { name: "import" });

		this.chooseFileButton = this.#page.getByLabel(
			"click or drag & drop to upload file",
		);
		this.submitButton = this.#page.getByRole("button", {
			name: "Submit",
			exact: true,
		});
	}

	async goto() {
		await this.#page.goto("/");
		await this.recoveryNavLink.click();
		await this.importTab.click();
		await expect(this.#page).toHaveURL(
			`/${rootRoute.recovery}/${recoveryRoute.import}`,
		);
	}
}
