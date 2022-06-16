import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import React, { FC, memo } from "react";

import { EditorMenu } from "./Menu";

export interface EditorProps {
	initialValue?: JSONContent;
	onChange?: (newContent: JSONContent) => void;
}

const EditorComponent: FC<EditorProps> = ({ initialValue, onChange }) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Link,
			Underline,
		],
		content: initialValue,
		onUpdate({ editor }) {
			const content = editor.getJSON();
			onChange && onChange(content);
		},
	});

	return (
		<div className="bg-gray-100 border border-black-200/10 pt-4 rounded">
			<EditorMenu editor={editor} />
			<EditorContent editor={editor} className="prose max-w-full" />
		</div>
	);
};

const Editor = memo(EditorComponent);
export default Editor;
