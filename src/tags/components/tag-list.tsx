import { cn } from '@/ui/utils/cn.ts';
import { IconButton, Text } from '@chakra-ui/react';
import { faCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import type { TagModel } from '../models/tag.model.ts';

export const TagList = memo(({ tags, onUpdate, onDelete }: TagListProps) => {
  return (
    <div className={cn(`flex flex-col divide-y divide-dashed`)}>
      {tags.map((tag) => (
        <div
          className={cn(`flex items-center gap-2`)}
          key={tag.id}>
          <FontAwesomeIcon
            icon={faCircle}
            color={tag.color}
          />

          <Text>{tag.name}</Text>

          <div className={cn(`flex-1`)} />

          <IconButton
            colorScheme="teal"
            aria-label="Update"
            variant="ghost"
            size="sm"
            icon={<FontAwesomeIcon icon={faPen} />}
            onClick={() => onUpdate(tag)}
          />

          <IconButton
            colorScheme="red"
            aria-label="Delete"
            variant="ghost"
            size="sm"
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={() => onDelete(tag.id)}
          />
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
