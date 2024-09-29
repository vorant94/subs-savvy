import { Text } from "@mantine/core";
import { IconFileCode } from "@tabler/icons-react";
import { memo, useCallback, useEffect, useState } from "react";
import { type FileWithPath, useDropzone } from "react-dropzone";
import { Icon } from "../../ui/components/icon.tsx";
import { cn } from "../../ui/utils/cn.ts";
import {
	type RecoveryModel,
	recoverySchema,
} from "../models/recovery.model.ts";

export const ImportRecoveryDropZone = memo(
	({ onRecoveryParsed }: ImportRecoveryDropZoneProps) => {
		const [reader] = useState(() => new FileReader());

		const readFile = useCallback(
			([file]: Array<FileWithPath>) => file && reader.readAsText(file),
			[reader],
		);

		const { getRootProps, getInputProps } = useDropzone({
			onDrop: readFile,
			multiple: false,
			// Playwright won't work without useFsAccessApi see https://github.com/microsoft/playwright/issues/8850
			useFsAccessApi: false,
			accept: { "application/json": [".json"] },
		});

		useEffect(() => {
			const controller = new AbortController();

			reader.addEventListener(
				"load",
				({ currentTarget }: ProgressEvent<FileReader>) => {
					if (!currentTarget) {
						throw new Error("currentTarget is missing");
					}

					const { result } = currentTarget as FileReader;
					if (typeof result !== "string") {
						throw new Error("type of result should be string");
					}

					onRecoveryParsed(recoverySchema.parse(JSON.parse(result)));
				},
				{ signal: controller.signal },
			);

			return () => controller.abort();
		});

		return (
			<button
				{...getRootProps({
					className: cn(
						"flex min-h-48 items-center justify-center rounded border-2 border-dashed hover:bg-gray-100",
					),
					"aria-label": "click or drag & drop to upload file",
				})}
			>
				<input {...getInputProps()} />
				<div
					className={cn(
						"grid grid-flow-row auto-rows-auto gap-x-4 lg:auto-cols-auto lg:grid-flow-col",
					)}
				>
					<Icon
						icon={IconFileCode}
						className={cn("justify-self-center text-gray-400 lg:row-span-2")}
						size="4em"
					/>
					<Text size="xl">Drag file here or click to select it</Text>
					<Text
						size="sm"
						c="dimmed"
					>
						Attach one file of JSON format
					</Text>
				</div>
			</button>
		);
	},
);

export interface ImportRecoveryDropZoneProps {
	onRecoveryParsed(recovery: RecoveryModel): void;
}
