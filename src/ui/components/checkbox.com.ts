import type { Locator } from "@playwright/test";

export class CheckboxCom {
	constructor(private readonly locator: Locator) {}

	async fill(value: boolean): Promise<void> {
		value ? await this.locator.check() : await this.locator.uncheck();
	}
}
