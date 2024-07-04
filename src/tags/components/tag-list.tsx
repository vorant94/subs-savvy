import { cn } from '@/ui/utils/cn.ts';
import { faCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Text } from '@mantine/core';
import { memo } from 'react';
import type { TagModel } from '../models/tag.model.ts';

export const TagList = memo(({ tags, onUpdate, onDelete }: TagListProps) => {
  return (
    <div className={cn(`flex flex-col divide-y divide-dashed`)}>
      {tags.map((tag) => (
        <div
          className={cn(`flex items-center gap-2 py-1`)}
          key={tag.id}>
          <FontAwesomeIcon
            icon={faCircle}
            color={tag.color}
          />

          <Text>{tag.name}</Text>

          <div className={cn(`flex-1`)} />

          <ActionIcon
            aria-label={`edit ${tag.name} tag`}
            variant="subtle"
            onClick={() => onUpdate(tag)}>
            <FontAwesomeIcon icon={faPen} />
          </ActionIcon>

          <ActionIcon
            aria-label={`delete ${tag.name} tag`}
            variant="subtle"
            color="red"
            onClick={() => onDelete(tag.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </ActionIcon>
        </div>
      ))}
    </div>
  );
});

export interface TagListProps {
  tags: Array<TagModel>;
  onDelete(id: number): Promise<void> | void;
  onUpdate(tag: TagModel): Promise<void> | void;
}
