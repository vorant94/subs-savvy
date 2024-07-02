import { DatePickerInputCom } from '@/ui/components/date-picker-input.com.ts';
import { InputCom } from '@/ui/components/input.com.ts';
import { SelectCom } from '@/ui/components/select.com.ts';
import { createDatePickerInputAriaLabels } from '@/ui/utils/create-date-picker-input-aria-labels.ts';
import type { Locator, Page } from '@playwright/test';
import {
  subscriptionCyclePeriodToLabel,
  type SubscriptionCyclePeriod,
} from '../types/subscription-cycle-period.ts';
import {
  subscriptionIconToLabel,
  type SubscriptionIcon,
} from '../types/subscription-icon.ts';

export class SubscriptionsPom {
  addSubscriptionButton: Locator;
  insertSubscriptionButton: Locator;
  updateSubscriptionButton: Locator;
  noSubscriptionsPlaceholder: Locator;

  nameInput: InputCom;
  descriptionTextarea: InputCom;
  iconSelect: SelectCom<SubscriptionIcon>;
  priceInput: InputCom;
  startedAtDatePickerInput: DatePickerInputCom;
  endedAtDatePickerInput: DatePickerInputCom;
  eachInput: InputCom;
  periodSelect: SelectCom<SubscriptionCyclePeriod>;

  private subscriptionsNavLink: Locator;

  constructor(private readonly page: Page) {
    this.addSubscriptionButton = this.page.getByRole('button', {
      name: 'add sub',
    });
    this.insertSubscriptionButton = this.page.getByRole('button', {
      name: 'insert',
    });
    this.updateSubscriptionButton = this.page.getByRole('button', {
      name: 'update',
    });
    this.noSubscriptionsPlaceholder = this.page.getByText('No Subscriptions');

    this.nameInput = new InputCom(this.page.getByLabel('name'));
    this.descriptionTextarea = new InputCom(
      this.page.getByLabel('description'),
    );
    this.iconSelect = new SelectCom(
      this.page.getByLabel('icon'),
      subscriptionIconToLabel,
    );
    this.priceInput = new InputCom(this.page.getByLabel('price'));
    this.startedAtDatePickerInput = new DatePickerInputCom(
      this.page.getByLabel('started at'),
      DatePickerInputCom.mapAriaLabelsToLocators(
        this.page,
        createDatePickerInputAriaLabels('started at'),
      ),
      this.page,
    );
    this.endedAtDatePickerInput = new DatePickerInputCom(
      this.page.getByLabel('ended at'),
      DatePickerInputCom.mapAriaLabelsToLocators(
        this.page,
        createDatePickerInputAriaLabels('ended at'),
      ),
      this.page,
    );
    this.eachInput = new InputCom(this.page.getByLabel('each'));
    this.periodSelect = new SelectCom(
      this.page.getByLabel('period'),
      subscriptionCyclePeriodToLabel,
    );

    this.subscriptionsNavLink = this.page.getByRole('link', {
      name: 'subscriptions',
    });
  }

  async goto() {
    await this.page.goto('/');
    await this.subscriptionsNavLink.click();
  }
}
