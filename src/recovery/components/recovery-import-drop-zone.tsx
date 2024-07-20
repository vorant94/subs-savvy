import { faFileCode } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text } from "@mantine/core";
import { memo, useCallback, useEffect } from "react";
import { type FileWithPath, useDropzone } from "react-dropzone";
import { cn } from "../../ui/utils/cn.ts";
import {
	type RecoveryModel,
	recoverySchema,
} from "../models/recovery.model.ts";

export const RecoveryImportDropZone = memo(
	({ onRecoveryParsed }: RecoveryImportDropZoneProps) => {
		const readFile = useCallback(
			([file]: Array<FileWithPath>) => file && reader.readAsText(file),
			[],
		);

		const { getRootProps, getInputProps } = useDropzone({
			onDrop: readFile,
			multiple: false,
			// Playwright won't work without useFsAccessApi see https://github.com/microsoft/playwright/issues/8850
			useFsAccessApi: false,
			accept: { "application/json": [".json"] },
		});

		useEffect(() => {
			reader.addEventListener("load", processFile);

			return () => {
				reader.removeEventListener("load", processFile);
			};
		});

		const processFile = ({ currentTarget }: ProgressEvent<FileReader>) => {
			if (!currentTarget) {
				throw new Error("currentTarget is missing");
			}

			const { result } = currentTarget as FileReader;
			if (typeof result !== "string") {
				throw new Error("type of result should be string");
			}

			onRecoveryParsed(recoverySchema.parse(JSON.parse(result)));
		};

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
				<div className={cn("grid auto-cols-auto grid-flow-col gap-x-4")}>
					<FontAwesomeIcon
						className={cn("row-span-2 text-gray-400")}
						size="4x"
						icon={faFileCode}
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

export interface RecoveryImportDropZoneProps {
	onRecoveryParsed(recovery: RecoveryModel): void;
}

const reader = new FileReader();
