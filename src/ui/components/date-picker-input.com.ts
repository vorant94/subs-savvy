import type { Locator, Page } from '@playwright/test';
import dayjs from 'dayjs';
import type { DatePickerInputAriaLabels } from '../utils/create-date-picker-input-aria-labels.ts';

export class DatePickerInputCom {
  constructor(
    private readonly locator: Locator,
    private readonly locators: DatePickerInputLocators,
    // page is still needed to select the actual day in the end of DatePickerInputCom#fill
    private readonly page: Page,
  ) {}

  async fill(value: Date): Promise<void> {
    await this.locator.click();

    const currentDateString = await this.locators.monthLevelControl.innerText();
    const currentDate = dayjs(currentDateString, 'MMMM YYYY').toDate();
    const diffInMonths = Math.round(
      dayjs(value).diff(currentDate, 'month', true),
    );
    for (let i = 0; i < Math.abs(diffInMonths); i++) {
      diffInMonths < 0
        ? await this.locators.previousMonth.click()
        : await this.locators.nextMonth.click();
    }

    const valueDateString = dayjs(value).format('D MMMM YYYY');
    await this.page.getByLabel(valueDateString, { exact: true }).click();
  }

  static mapAriaLabelsToLocators(
    page: Page,
    ariaLabels: DatePickerInputAriaLabels,
  ): DatePickerInputLocators {
    return Object.entries(ariaLabels).reduce<DatePickerInputLocators>(
      (prev, [key, value]) => {
        prev[key as keyof DatePickerInputAriaLabels] = page.getByLabel(value);

        return prev;
      },
      {} as DatePickerInputLocators,
    );
  }
}

export type DatePickerInputLocators = {
  [T in keyof DatePickerInputAriaLabels]: Locator;
};