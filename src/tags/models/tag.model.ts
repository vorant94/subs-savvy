import { z } from 'zod';

export const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
});
export type TagModel = z.infer<typeof tagSchema>;

export const insertTagSchema = tagSchema.omit({ id: true });
export type InsertTagModel = z.infer<typeof insertTagSchema>;

export const updateTagSchema = tagSchema.omit({});
export type UpdateTagModel = z.infer<typeof updateTagSchema>;

export type UpsertTagModel = InsertTagModel | UpdateTagModel;
