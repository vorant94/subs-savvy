import { cn } from '@/ui/utils/cn.ts';
import { faFileCode } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Group, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { memo, useCallback, useEffect } from 'react';
import type { FileWithPath } from 'react-dropzone-esm';
import { recoverySchema } from '../models/recovery.model.ts';

export const RecoveryImportPage = memo(() => {
  const processExportFile = ({ currentTarget }: ProgressEvent<FileReader>) => {
    if (!currentTarget) {
      throw new Error(`currentTarget is missing`);
    }

    const { result } = currentTarget as FileReader;
    if (typeof result !== 'string') {
      throw new Error(`type of result should be string`);
    }

    // TODO validate dbVersion
    const { dbVersion, subscriptions } = recoverySchema.parse(
      JSON.parse(result),
    );
    console.log(dbVersion, subscriptions);
  };

  useEffect(() => {
    reader.addEventListener('load', processExportFile);

    return () => {
      reader.removeEventListener('load', processExportFile);
    };
  });

  const readExportFile = useCallback(
    ([file]: Array<FileWithPath>) => file && reader.readAsText(file),
    [],
  );

  return (
    <div className={cn(`flex flex-col gap-4`)}>
      <Dropzone
        onDrop={readExportFile}
        multiple={false}
        accept={['application/json']}>
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: 'none' }}>
          <Dropzone.Idle>
            <FontAwesomeIcon
              style={{
                color: 'var(--mantine-color-dimmed)',
              }}
              size="4x"
              icon={faFileCode}
            />
          </Dropzone.Idle>

          <div>
            <Text
              size="xl"
              inline>
              Drag file here or click to select it
            </Text>
            <Text
              size="sm"
              c="dimmed"
              inline
              mt={7}>
              Attach one file of JSON format
            </Text>
          </div>
        </Group>
      </Dropzone>
    </div>
  );
});

const reader = new FileReader();
