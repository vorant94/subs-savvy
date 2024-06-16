import { db } from '@/db/globals/db.ts';
import {
  insertTagSchema,
  tagSchema,
  updateTagSchema,
  type InsertTagModel,
  type TagModel,
  type UpdateTagModel,
} from './tag.model.ts';

export async function findTags(): Promise<Array<TagModel>> {
  const raws = await db.tags.toArray();

  return raws.map((raw) => tagSchema.parse(raw));
}

export async function getTag(id: number): Promise<TagModel> {
  const raw = await db.tags.get(id);
  if (!raw) {
    throw new Error(`Tag not found!`);
  }

  return tagSchema.parse(raw);
}

export async function insertTag(raw: InsertTagModel): Promise<TagModel> {
  const parsed = insertTagSchema.parse(raw);

  const id = await db.tags.add(parsed);
  return await getTag(id);
}

export async function updateTag(raw: UpdateTagModel): Promise<TagModel> {
  const { id, ...rest } = updateTagSchema.parse(raw);

  await db.tags.update(id, rest);
  return await getTag(id);
}

export async function deleteTag(id: number): Promise<void> {
  await db.tags.delete(id);
}
