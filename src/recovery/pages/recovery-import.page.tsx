import { SubscriptionsInsertTable } from '@/subscriptions/components/subscriptions-insert-table.tsx';
import {
  insertSubscriptionSchema,
  type UpsertSubscriptionModel,
} from '@/subscriptions/models/subscription.model.ts';
import { cn } from '@/ui/utils/cn.ts';
import { faFileCode } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { memo, useCallback, useEffect, useState } from 'react';
import type { FileWithPath } from 'react-dropzone-esm';
import { recoverySchema } from '../models/recovery.model.ts';

export const RecoveryImportPage = memo(() => {
  const [subscriptions, setSubscriptions] = useState<
    Array<UpsertSubscriptionModel>
  >([]);

  const readExportFile = useCallback(
    ([file]: Array<FileWithPath>) => file && reader.readAsText(file),
    [],
  );
  useEffect(() => {
    reader.addEventListener('load', processExportFile);

    return () => {
      reader.removeEventListener('load', processExportFile);
    };
  });
  const processExportFile = ({ currentTarget }: ProgressEvent<FileReader>) => {
    if (!currentTarget) {
      throw new Error(`currentTarget is missing`);
    }

    const { result } = currentTarget as FileReader;
    if (typeof result !== 'string') {
      throw new Error(`type of result should be string`);
    }

    // TODO validate dbVersion
    const { subscriptions } = recoverySchema.parse(JSON.parse(result));

    setSubscriptions(
      subscriptions.map((subscription) =>
        insertSubscriptionSchema.parse({ ...subscription, tags: [] }),
      ),
    );
  };

  const [formId, setFormId] = useState('');
  const updateFormId: (ref: HTMLFormElement | null) => void = useCallback(
    (ref) => setFormId(ref?.getAttribute('id') ?? ''),
    [],
  );

  const clearSubscriptions = useCallback(() => {
    setSubscriptions([]);
  }, []);

  return (
    <div className={cn(`flex flex-col gap-4`)}>
      <Dropzone
        onDrop={readExportFile}
        multiple={false}
        accept={['application/json']}>
        <div
          className={cn(
            `pointer-events-none flex min-h-40 items-center justify-center gap-4`,
          )}>
          <Dropzone.Idle>
            <FontAwesomeIcon
              style={{
                color: 'var(--mantine-color-dimmed)',
              }}
              size="4x"
              icon={faFileCode}
            />
          </Dropzone.Idle>

          <div className={cn(`flex flex-col gap-1`)}>
            <Text size="xl">Drag file here or click to select it</Text>
            <Text
              size="sm"
              c="dimmed">
              Attach one file of JSON format
            </Text>
          </div>
        </div>
      </Dropzone>

      {subscriptions.length ? (
        <>
          <SubscriptionsInsertTable
            subscriptions={subscriptions}
            ref={updateFormId}
            onInsert={clearSubscriptions}
          />

          <div className={cn(`flex items-center`)}>
            <div className={cn('flex-1')} />

            <Button
              form={formId}
              type="submit">
              import
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
});

const reader = new FileReader();
