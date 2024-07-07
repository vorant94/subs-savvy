import type { Locator, Page } from '@playwright/test';

export class RecoveryImportPom {
  recoveryNavLink: Locator;
  importTab: Locator;

  chooseFileButton: Locator;
  importButton: Locator;

  constructor(private readonly page: Page) {
    this.recoveryNavLink = this.page.getByRole('link', {
      name: 'recovery',
    });
    this.importTab = this.page.getByRole('tab', {
      name: 'import',
    });

    this.chooseFileButton = this.page.getByLabel(
      'click or drag & drop to upload file',
    );
    this.importButton = this.page.getByRole('button', { name: 'import' });
  }

  async goto() {
    await this.page.goto('/');
    await this.recoveryNavLink.click();
    await this.importTab.click();
  }
}
