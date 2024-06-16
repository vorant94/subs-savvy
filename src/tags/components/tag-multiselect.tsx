import { cn } from '@/ui/utils/cn.ts';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, MultiSelect, type ComboboxData } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { TagModel } from '../models/tag.model.ts';
import { findTags } from '../models/tag.table.ts';
import { ManageTagsModal } from './manage-tags-modal.tsx';

export const TagMultiselect = memo(({ onChange }: TagsSelectProps) => {
  const [selectedTags, setSelectedTags] = useState<Array<TagModel>>([]);
  const tags = useLiveQuery(() => findTags());
  const [isManageTagsOpen, manageTags] = useDisclosure(false);

  useEffect(() => {
    onChange(selectedTags);
  }, [onChange, selectedTags]);

  const tagsData: ComboboxData = useMemo(() => {
    return (tags ?? []).map((tag) => ({
      label: tag.name,
      value: `${tag.id}`,
    }));
  }, [tags]);

  const updateSelectedTags: (value: string[]) => void = useCallback(
    (tagIds) => {
      setSelectedTags(
        tagIds.map(
          (tagId) => (tags ?? []).find((tag) => `${tag.id}` === tagId)!,
        ),
      );
    },
    [tags],
  );

  return (
    <>
      <div className={cn(`flex items-center gap-2`)}>
        <MultiSelect
          aria-label="Select Tags"
          placeholder="Select Tags"
          clearable
          data={tagsData}
          onChange={updateSelectedTags}
        />

        <ActionIcon
          aria-label="Manage Tags"
          onClick={manageTags.open}
          size="lg"
          variant="light">
          <FontAwesomeIcon
            className={cn(`mr-1`)}
            icon={faSliders}
          />
        </ActionIcon>
      </div>

      <ManageTagsModal
        isOpen={isManageTagsOpen}
        close={manageTags.close}
      />
    </>
  );
});

export interface TagsSelectProps {
  onChange(tags: Array<TagModel>): void;
}
