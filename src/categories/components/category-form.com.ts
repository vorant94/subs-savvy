import { InputCom } from '@/ui/components/input.com';
import type { Page } from '@playwright/test';

export class CategoryFormCom {
  nameControl: InputCom;
  colorControl: InputCom;

  constructor(private readonly page: Page) {
    this.nameControl = new InputCom(this.page.getByLabel('name'));
    this.colorControl = new InputCom(this.page.getByLabel('color'));
  }
}
