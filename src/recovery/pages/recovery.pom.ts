import type { Locator, Page } from '@playwright/test';

export class RecoveryPom {
  recoveryNavLink: Locator;

  constructor(private readonly page: Page) {
    this.recoveryNavLink = this.page.getByRole('link', {
      name: 'recovery',
    });
  }

  async goto() {
    await this.page.goto('/');
    await this.recoveryNavLink.click();
  }
}
