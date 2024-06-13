import type { RawFormValue } from '@/form/types/raw-form-value.ts';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  type UseDisclosureReturn,
} from '@chakra-ui/react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  memo,
  useCallback,
  useReducer,
  useState,
  type Reducer,
  type RefCallback,
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
  ({ isOpen, onClose }: ManageTagsModalProps) => {
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
    const [formId, setFormId] = useState('');

    const formRef: RefCallback<HTMLFormElement> = useCallback((ref) => {
      setFormId(ref?.getAttribute('id') ?? '');
    }, []);

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
          ? await updateTag(raw as RawFormValue<UpdateTagModel>)
          : await insertTag(raw as RawFormValue<InsertTagModel>);

        dispatch({ type: 'view' });
      },
      [state],
    );

    const deleteTagCb: TagListProps['onDelete'] = useCallback(async (id) => {
      await deleteTag(id);
    }, []);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Tags</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {state.mode === 'view' ? (
              <TagList
                tags={tags ?? []}
                onUpdate={switchToUpdateMode}
                onDelete={deleteTagCb}
              />
            ) : (
              <TagForm
                onSubmit={upsertTag}
                ref={formRef}
                tag={state.mode === 'update' ? state.tag : null}
              />
            )}
          </ModalBody>

          <ModalFooter>
            {state.mode === 'view' ? (
              <Button
                type="button"
                colorScheme="teal"
                onClick={switchToInsertMode}>
                add tag
              </Button>
            ) : (
              <Button
                type="submit"
                colorScheme="teal"
                form={formId}>
                {state.mode === 'update' ? 'Update' : 'Insert'}
              </Button>
            )}
            {state.mode !== 'view' ? (
              <Button
                type="button"
                variant="ghost"
                onClick={switchToViewMode}>
                Cancel
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
);

export interface ManageTagsModalProps extends UseDisclosureReturn {}

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
