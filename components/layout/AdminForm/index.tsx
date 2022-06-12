import type { JSONContent } from "@tiptap/react";

import { Button } from "components/input/Button";
import dynamic from "next/dynamic";
import React, { Children, FC, FormEventHandler, memo, ReactNode } from "react";

// import { PostView } from "components/view/Post";
import { Main } from "../Main";

export interface AdminFormProps {
	title: string;
	children: ReactNode;

	onFormSubmit: FormEventHandler<HTMLFormElement>;

	submitLabel?: string;
	loading?: boolean;
	editorContent?: JSONContent;
	onEditorChange?: (newContent: JSONContent) => void;
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
}) => {
	return (
		<Main title={title}>
			<form onSubmit={onFormSubmit} className="flex flex-col">
				<div className="flex flex-col justify-between items-center gap-4 px-2 pb-5 sm:flex-row">
					<div className="flex flex-wrap w-full gap-4">
						{Children.toArray(children)[0]}
					</div>
					<Button className="bg-primary-400" type="submit" loading={loading}>
						{submitLabel || "Enviar"}
					</Button>
				</div>

				{/* Tab com preview */}
				<DynamicEditor initialValue={editorContent} onChange={onEditorChange} />
				{/* <PostView
						title={title || post.title}
						description={description || post.description}
						metadata={{ ...post.metadata, updatedAt: Date.now() }}
						content={editorContent}
					/> */}
			</form>
		</Main>
	);
};

export const AdminForm = memo(AdminFormComponent);
