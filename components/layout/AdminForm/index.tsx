import { Tab } from "@headlessui/react";
import type { JSONContent } from "@tiptap/core";

import { Button } from "components/input/Button";
import { useJSON } from "hooks/useJSON";
import dynamic from "next/dynamic";
import React, { Children, FC, FormEventHandler, Fragment, memo, ReactNode } from "react";

import { Main } from "../Main";

export interface AdminFormProps {
	title: string;
	children: ReactNode;

	onFormSubmit: FormEventHandler<HTMLFormElement>;

	submitLabel?: string;
	loading?: boolean;
	editorContent?: JSONContent;
	onEditorChange?: (newContent: JSONContent) => void;
	noEditor?: boolean;
}

const DynamicEditor = dynamic(() => import("components/input/Editor"));

const AdminFormComponent: FC<AdminFormProps> = ({
	title,
	children,
	onFormSubmit,
	submitLabel,
	loading,
	editorContent,
	onEditorChange,
	noEditor,
}) => {
	const contentHTML = useJSON(editorContent || { type: "doc", content: [] });

	return (
		<Main title={title}>
			<form onSubmit={onFormSubmit} className="flex flex-col">
				<div className="flex flex-col justify-between items-center gap-4 px-2 pb-5 sm:flex-row">
					<div className="flex flex-col flex-wrap w-full gap-4">
						{Children.toArray(children)[0]}
					</div>
					<Button
						className="bg-primary-400 w-full sm:w-fit sm:px-3"
						type="submit"
						loading={loading}
					>
						{submitLabel || "Enviar"}
					</Button>
				</div>

				{!noEditor && (
					<Tab.Group>
						<Tab.List className="flex items-center w-full gap-2 p-2">
							<Tab as={Fragment}>
								{({ selected }) => (
									<button
										type="button"
										className={`${
											selected
												? "bg-primary-300 border border-primary-400 hover:brightness-95"
												: "bg-cream-100 border border-black-200/10 hover:border-black-200/20"
										} w-1/2 outline-none p-2 rounded duration-200`}
									>
										Editor
									</button>
								)}
							</Tab>
							<Tab as={Fragment}>
								{({ selected }) => (
									<button
										type="button"
										className={`${
											selected
												? "bg-primary-300 border border-primary-400 hover:brightness-95"
												: "bg-cream-100 border border-black-200/10 hover:border-black-200/20"
										} w-1/2 outline-none p-2 rounded duration-200 truncate disabled:cursor-not-allowed disabled:brightness-90`}
										disabled={!editorContent}
									>
										Pré-visualização
									</button>
								)}
							</Tab>
						</Tab.List>
						<Tab.Panels className="transition-transform">
							<Tab.Panel className="animate-appear">
								<DynamicEditor
									initialValue={editorContent}
									onChange={onEditorChange}
								/>
							</Tab.Panel>
							<Tab.Panel className="pt-4 animate-appear">
								{editorContent && (
									<div
										className="prose w-full"
										/* # skipcq: JS-0440 */
										dangerouslySetInnerHTML={{ __html: contentHTML }}
									/>
								)}
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				)}
			</form>
		</Main>
	);
};

export const AdminForm = memo(AdminFormComponent);
