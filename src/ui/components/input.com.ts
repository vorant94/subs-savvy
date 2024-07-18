import type { Locator } from "@playwright/test";

export class InputCom {
	constructor(private readonly locator: Locator) {}

	async fill(value: string | number): Promise<void> {
		await this.locator.fill(`${value}`);
	}
}
