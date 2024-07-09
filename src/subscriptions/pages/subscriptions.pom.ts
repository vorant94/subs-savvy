import { CategoryFormCom } from '@/categories/components/category-form.com.ts';
import type {
  CategoryModel,
  UpsertCategoryModel,
} from '@/categories/models/category.model.ts';
import type { Locator, Page } from '@playwright/test';
import { SubscriptionUpsertCom } from '../components/subscription-upsert.com';
import type {
  SubscriptionModel,
  UpsertSubscriptionModel,
} from '../models/subscription.model';

export class SubscriptionsPom {
  addSubscriptionButton: Locator;
  noSubscriptionsPlaceholder: Locator;

  subscriptionUpsert: SubscriptionUpsertCom;

  manageCategoriesButton: Locator;
  addCategoryButton: Locator;
  insertCategoryButton: Locator;
  updateCategoryButton: Locator;

  categoryForm: CategoryFormCom;

  subscriptionsNavLink: Locator;

  constructor(private readonly page: Page) {
    this.addSubscriptionButton = this.page.getByRole('button', {
      name: 'add sub',
    });
    this.noSubscriptionsPlaceholder = this.page.getByText('No Subscriptions');

    this.subscriptionUpsert = new SubscriptionUpsertCom(this.page);

    this.manageCategoriesButton = page.getByRole('button', { name: 'manage' });
    this.addCategoryButton = page.getByRole('button', { name: 'add category' });
    this.insertCategoryButton = this.page.getByRole('button', {
      name: 'insert',
    });
    this.updateCategoryButton = this.page.getByRole('button', {
      name: 'update',
    });

    this.categoryForm = new CategoryFormCom(this.page);

    this.subscriptionsNavLink = this.page.getByRole('link', {
      name: 'subscriptions',
    });
  }

  async goto() {
    await this.page.goto('/');
    await this.subscriptionsNavLink.click();
  }

  async fillSubscriptionUpsert(
    subscription: UpsertSubscriptionModel,
  ): Promise<void> {
    await this.subscriptionUpsert.nameControl.fill(subscription.name);

    if (subscription.description) {
      await this.subscriptionUpsert.descriptionControl.fill(
        subscription.description,
      );
    }

    await this.subscriptionUpsert.iconControl.fill(subscription.icon);
    await this.subscriptionUpsert.priceControl.fill(subscription.price);
    await this.subscriptionUpsert.startedAtControl.fill(subscription.startedAt);

    if (subscription.endedAt) {
      await this.subscriptionUpsert.endedAtControl.fill(subscription.endedAt);
    }

    await this.subscriptionUpsert.eachControl.fill(subscription.cycle.each);
    await this.subscriptionUpsert.periodControl.fill(subscription.cycle.period);

    // TODO: add filling category multiselect here
  }

  async fillCategoryForm(category: UpsertCategoryModel): Promise<void> {
    await this.categoryForm.nameControl.fill(category.name);
    await this.categoryForm.colorControl.fill(category.color);
  }

  subscriptionListItem({
    name,
  }: SubscriptionModel | UpsertSubscriptionModel): Locator {
    return this.page.getByLabel(name);
  }

  category({ name }: CategoryModel | UpsertCategoryModel): Locator {
    return this.page.getByRole('paragraph').filter({ hasText: name });
  }

  editCategoryButton({ name }: CategoryModel | UpsertCategoryModel): Locator {
    return this.page.getByRole('button', { name: `edit ${name} category` });
  }

  deleteCategoryButton({ name }: CategoryModel | UpsertCategoryModel): Locator {
    return this.page.getByRole('button', { name: `delete ${name} category` });
  }
}
