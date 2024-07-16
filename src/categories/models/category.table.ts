import { db } from '../../db/globals/db.ts';
import {
  categorySchema,
  insertCategorySchema,
  updateCategorySchema,
  type CategoryModel,
  type InsertCategoryModel,
  type UpdateCategoryModel,
} from './category.model.ts';

export async function findCategories(): Promise<ReadonlyArray<CategoryModel>> {
  return db.transaction('r', db.categories, async () => {
    const raws = await db.categories.toArray();

    return raws.map((raw) => categorySchema.parse(raw));
  });
}

export async function insertCategory(
  raw: InsertCategoryModel,
): Promise<CategoryModel> {
  return db.transaction('rw', db.categories, async () => {
    const parsed = insertCategorySchema.parse(raw);

    const id = await db.categories.add(parsed);
    return await _getCategory(id);
  });
}

export async function updateCategory(
  raw: UpdateCategoryModel,
): Promise<CategoryModel> {
  return db.transaction('rw', db.categories, async () => {
    const { id, ...rest } = updateCategorySchema.parse(raw);

    await db.categories.update(id, rest);
    return await _getCategory(id);
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return db.transaction('rw', db.categories, db.subscriptions, async () => {
    const categorySubscriptions = await db.subscriptions
      .where({ categoryId: id })
      .toArray();
    const subscriptionUpdates = categorySubscriptions.map(
      ({ id, categoryId: _, ...rest }) =>
        db.subscriptions.update(id, { ...rest, categoryId: null }),
    );

    await Promise.all([db.categories.delete(id), ...subscriptionUpdates]);
  });
}

async function _getCategory(id: number): Promise<CategoryModel> {
  const raw = await db.categories.get(id);
  if (!raw) {
    throw new Error(`Category not found!`);
  }

  return categorySchema.parse(raw);
}
