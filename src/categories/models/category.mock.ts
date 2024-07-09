import type { CategoryModel } from './category.model.ts';

export const category = {
  id: 1,
  name: 'Basics',
  color: '#000000',
} as const satisfies CategoryModel;
