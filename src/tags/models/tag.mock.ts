import type { TagModel } from './tag.model.ts';

export const tag = {
  id: 1,
  name: 'Basics',
  color: '#000000',
} as const satisfies TagModel;
