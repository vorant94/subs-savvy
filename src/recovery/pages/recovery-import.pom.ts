import type { Locator, Page } from "@playwright/test";

export class RecoveryImportPom {
	readonly recoveryNavLink: Locator;
	readonly importTab: Locator;

	readonly chooseFileButton: Locator;
	readonly importButton: Locator;

	readonly #page: Page;

	constructor(page: Page) {
		this.#page = page;

		this.recoveryNavLink = this.#page.getByRole("link", { name: "recovery" });
		this.importTab = this.#page.getByRole("tab", { name: "import" });

		this.chooseFileButton = this.#page.getByLabel(
			"click or drag & drop to upload file",
		);
		this.importButton = this.#page.getByRole("button", { name: "import" });
	}

	async goto() {
		await this.#page.goto("/");
		await this.recoveryNavLink.click();
		await this.importTab.click();
	}
}
