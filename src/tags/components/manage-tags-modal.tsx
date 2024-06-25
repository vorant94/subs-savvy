import { cn } from '@/ui/utils/cn.ts';
import { Button, Modal } from '@mantine/core';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useState,
  type Reducer,
} from 'react';
import type {
  InsertTagModel,
  TagModel,
  UpdateTagModel,
} from '../models/tag.model.ts';
import {
  deleteTag,
  findTags,
  insertTag,
  updateTag,
} from '../models/tag.table.ts';
import { TagForm, type TagFormProps } from './tag-form.tsx';
import { TagList, type TagListProps } from './tag-list.tsx';

export const ManageTagsModal = memo(
  ({ isOpen, close }: ManageTagsModalProps) => {
    const tags = useLiveQuery(() => findTags());
    const [state, dispatch] = useReducer<
      Reducer<ManageTagsModalState, ManageTagsModalAction>
    >((_, action) => {
      switch (action.type) {
        case 'upsert': {
          return action.tag
            ? { tag: action.tag, mode: 'update' }
            : { mode: 'insert' };
        }
        case 'view': {
          return stateDefaults;
        }
      }
    }, stateDefaults);

    const switchToInsertMode = useCallback(() => {
      dispatch({ type: 'upsert' });
    }, []);

    const switchToViewMode = useCallback(() => {
      dispatch({ type: 'view' });
    }, []);

    const switchToUpdateMode: TagListProps['onUpdate'] = useCallback((tag) => {
      dispatch({ type: 'upsert', tag });
    }, []);

    const upsertTag: TagFormProps['onSubmit'] = useCallback(
      async (raw) => {
        if (state.mode === 'view') {
          throw new Error(`Nothing to upsert in view mode`);
        }

        state.mode === 'update'
          ? await updateTag(raw as UpdateTagModel)
          : await insertTag(raw as InsertTagModel);

        switchToViewMode();
      },
      [state, switchToViewMode],
    );

    const deleteTagCb: TagListProps['onDelete'] = useCallback(async (id) => {
      await deleteTag(id);
    }, []);

    useEffect(() => {
      if (!isOpen && state.mode !== 'view') {
        dispatch({ type: 'view' });
      }
    }, [isOpen, state]);

    const [formId, setFormId] = useState('');
    const updateFormId: (ref: HTMLFormElement | null) => void = useCallback(
      (ref) => setFormId(ref?.getAttribute('id') ?? ''),
      [],
    );

    return (
      <Modal
        opened={isOpen}
        onClose={close}
        title="Manage Tags">
        <div className={cn(`flex flex-col gap-4`)}>
          {state.mode === 'view' ? (
            <TagList
              tags={tags ?? []}
              onUpdate={switchToUpdateMode}
              onDelete={deleteTagCb}
            />
          ) : (
            <TagForm
              ref={updateFormId}
              onSubmit={upsertTag}
              tag={state.mode === 'update' ? state.tag : null}
            />
          )}

          <div className={cn(`flex justify-end gap-2`)}>
            {state.mode === 'view' ? (
              <Button
                type="button"
                key="add-tag"
                onClick={switchToInsertMode}>
                add tag
              </Button>
            ) : (
              <Button
                type="submit"
                key="submit-tag-form"
                form={formId}>
                {state.mode === 'update' ? 'Update' : 'Insert'}
              </Button>
            )}
            {state.mode !== 'view' ? (
              <Button
                type="button"
                key="cancel-tag-form"
                variant="outline"
                onClick={switchToViewMode}>
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      </Modal>
    );
  },
);

export interface ManageTagsModalProps {
  isOpen: boolean;
  close: () => void;
}

type ManageTagsModalState =
  | {
      tag: TagModel;
      mode: 'update';
    }
  | {
      mode: 'view';
    }
  | {
      mode: 'insert';
    };

const stateDefaults: ManageTagsModalState = {
  mode: 'view',
};

interface ManageTagsModalUpsertAction {
  type: 'upsert';
  tag?: TagModel | null;
}

interface ManageTagsModalViewAction {
  type: 'view';
}

type ManageTagsModalAction =
  | ManageTagsModalUpsertAction
  | ManageTagsModalViewAction;
