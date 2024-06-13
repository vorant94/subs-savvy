import { cn } from '@/ui/utils/cn.ts';
import { Tag, TagCloseButton, TagLabel, useDisclosure } from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { TagModel } from '../models/tag.model.ts';
import { findTags } from '../models/tag.table.ts';
import { ManageTagsModal } from './manage-tags-modal.tsx';

export const TagsSelect = memo(({ onChange }: TagsSelectProps) => {
  const [selectedTags, setSelectedTags] = useState<Array<TagModel>>([]);
  const tags = useLiveQuery(() => findTags());
  const manageTagsDisclosure = useDisclosure();

  useEffect(() => {
    onChange(selectedTags);
  }, [onChange, selectedTags]);

  const unSelectedTags = useMemo(
    () => (tags ?? []).filter((tag) => !selectedTags.includes(tag)),
    [selectedTags, tags],
  );

  const clearSelectedTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const selectTag = (tag: TagModel) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const unSelectTag = (tag: TagModel) => {
    setSelectedTags(selectedTags.filter((selected) => selected !== tag));
  };

  const manageTags = useCallback(() => {
    manageTagsDisclosure.onOpen();
  }, [manageTagsDisclosure]);

  return (
    <>
      <div className={cn(`flex items-center gap-2`)}>
        <span>Tags:</span>
        {tags?.length === 0 ? <span>no tags to show</span> : null}
        {selectedTags.length ? (
          <Tag
            as="button"
            size="sm"
            onClick={clearSelectedTags}>
            <TagLabel>Clear</TagLabel>
            <TagCloseButton as="span" />
          </Tag>
        ) : null}
        {selectedTags.map((tag) => (
          <Tag
            as="button"
            size="sm"
            key={tag.id}
            colorScheme="teal"
            variant="solid"
            onClick={() => unSelectTag(tag)}>
            <TagLabel>{tag.name}</TagLabel>
          </Tag>
        ))}
        {unSelectedTags.map((tag) => (
          <Tag
            as="button"
            size="sm"
            key={tag.id}
            colorScheme="teal"
            variant="outline"
            onClick={() => selectTag(tag)}>
            <TagLabel>{tag.name}</TagLabel>
          </Tag>
        ))}
        <Tag
          as="button"
          size="sm"
          onClick={manageTags}>
          Manage
        </Tag>
      </div>

      <ManageTagsModal {...manageTagsDisclosure} />
    </>
  );
});

export interface TagsSelectProps {
  onChange(tags: Array<TagModel>): void;
}
