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
  return db.transaction('r', db.tags, async () => {
    const raws = await db.tags.toArray();

    return raws.map((raw) => tagSchema.parse(raw));
  });
}

export async function insertTag(raw: InsertTagModel): Promise<TagModel> {
  return db.transaction('rw', db.tags, async () => {
    const parsed = insertTagSchema.parse(raw);

    const id = await db.tags.add(parsed);
    return await _getTag(id);
  });
}

export async function updateTag(raw: UpdateTagModel): Promise<TagModel> {
  return db.transaction('rw', db.tags, async () => {
    const { id, ...rest } = updateTagSchema.parse(raw);

    await db.tags.update(id, rest);
    return await _getTag(id);
  });
}

export async function deleteTag(id: number): Promise<void> {
  return db.transaction('rw', db.tags, db.subscriptionsTags, async () => {
    await Promise.all([
      db.tags.delete(id),
      db.subscriptionsTags.where({ tagId: id }).delete(),
    ]);
  });
}

async function _getTag(id: number): Promise<TagModel> {
  const raw = await db.tags.get(id);
  if (!raw) {
    throw new Error(`Tag not found!`);
  }

  return tagSchema.parse(raw);
}
