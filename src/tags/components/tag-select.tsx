import { SubscriptionsContext } from '@/subscriptions/providers/subscriptions.provider.tsx';
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
import { useDisclosure, usePrevious } from '@mantine/hooks';
import { memo, useContext, useEffect } from 'react';
import { ManageTagsModal } from './manage-tags-modal.tsx';

export const TagSelect = memo(() => {
  const { tags, selectTag, selectedTag } = useContext(SubscriptionsContext);
  const prevSelectedTag = usePrevious(selectedTag);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useEffect(() => {
    if (selectedTag?.id !== prevSelectedTag?.id) {
      combobox.closeDropdown();
    }
  }, [selectedTag, prevSelectedTag, combobox]);

  const [isManageTagsOpen, manageTags] = useDisclosure(false);

  return (
    <>
      <div className={cn(`flex items-center gap-2`)}>
        <Combobox
          store={combobox}
          onOptionSubmit={selectTag}>
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
                    onClick={() => selectTag(null)}
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
