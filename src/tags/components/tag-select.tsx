import { cn } from '@/ui/utils/cn.ts';
import { faCircle, faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ActionIcon,
  CloseButton,
  Combobox,
  Input,
  InputBase,
  useCombobox,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { memo, useCallback, useEffect, useState } from 'react';
import type { TagModel } from '../models/tag.model.ts';
import { findTags } from '../models/tag.table.ts';
import { ManageTagsModal } from './manage-tags-modal.tsx';

export const TagSelect = memo(({ onChange }: TagsSelectProps) => {
  const tags = useLiveQuery(() => findTags());

  const [selectedTag, setSelectedTag] = useState<TagModel | null>(null);
  useEffect(() => {
    onChange(selectedTag);
  }, [onChange, selectedTag]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const setSelectedTagById: (tagId: string | null) => void = useCallback(
    (tagId) => {
      if (tagId) {
        setSelectedTag(
          (tags ?? []).find((tag) => `${tag.id}` === tagId) ?? null,
        );
      } else {
        setSelectedTag(null);
      }

      combobox.closeDropdown();
    },
    [combobox, tags],
  );

  const [isManageTagsOpen, manageTags] = useDisclosure(false);

  return (
    <>
      <div className={cn(`flex items-center gap-2`)}>
        <Combobox
          store={combobox}
          onOptionSubmit={setSelectedTagById}>
          <Combobox.Target>
            <InputBase
              className={cn(`w-48`)}
              component="button"
              type="button"
              pointer
              leftSection={
                selectedTag ? (
                  <FontAwesomeIcon
                    color={selectedTag.color}
                    icon={faCircle}
                  />
                ) : null
              }
              rightSection={
                selectedTag ? (
                  <CloseButton
                    size="sm"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setSelectedTagById(null)}
                    aria-label="Clear value"
                  />
                ) : (
                  <Combobox.Chevron />
                )
              }
              rightSectionPointerEvents={selectedTag ? 'all' : 'none'}
              onClick={() => combobox.toggleDropdown()}>
              {selectedTag?.name ?? (
                <Input.Placeholder>Select tag</Input.Placeholder>
              )}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {(tags ?? []).map((tag) => (
                <Combobox.Option
                  value={`${tag.id}`}
                  key={tag.id}>
                  <FontAwesomeIcon
                    color={tag.color}
                    icon={faCircle}
                  />{' '}
                  {tag.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

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
  onChange(tags: TagModel | null): void;
}
