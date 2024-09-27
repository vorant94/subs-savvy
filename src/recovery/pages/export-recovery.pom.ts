import { type Locator, type Page, expect } from "@playwright/test";
import { CheckboxCom } from "../../ui/components/checkbox.com.ts";
import { rootRoute } from "../../ui/types/root-route.ts";
import { recoveryRoute } from "../types/recovery-route.ts";

export class ExportRecoveryPom {
	readonly recoveryNavLink: Locator;
	readonly exportTab: Locator;
	readonly exportButton: Locator;

	readonly selectAllSubscriptions: CheckboxCom;

	readonly #page: Page;

	constructor(page: Page) {
		this.#page = page;

		this.recoveryNavLink = this.#page.getByRole("link", { name: "recovery" });
		this.exportTab = this.#page.getByRole("tab", { name: "export" });
		this.exportButton = this.#page.getByRole("button", { name: "export" });

		this.selectAllSubscriptions = new CheckboxCom(
			this.#page.getByLabel("select all subscriptions"),
		);
	}

	async goto() {
		await this.#page.goto("/");
		await this.recoveryNavLink.click();
		await this.exportTab.click();
		await expect(this.#page).toHaveURL(
			`/${rootRoute.recovery}/${recoveryRoute.export}`,
		);
	}
}
