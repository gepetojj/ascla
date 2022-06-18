import { EditorContent, JSONContent, useEditor } from "@tiptap/react";

import { editorExtensions } from "helpers/editorExtensions";
import propTypes from "prop-types";
import React, { FC, memo } from "react";

import { EditorProvider } from "./Context";
import { EditorMenu } from "./Menu";

export interface EditorProps {
	/** Valor inicial do editor. */
	initialValue?: JSONContent;
	/** Callback para alterar o valor do editor. */
	onChange?: (newContent: JSONContent) => void;
}

/**
 * Renderiza um editor de texto.
 *
 * @see {@link EditorProps}
 *
 * @param {EditorProps} ...props Props do componente, desestruturadas
 * @returns {FC<EditorProps>} Componente
 */
const EditorComponent: FC<EditorProps> = ({ initialValue, onChange }) => {
	const editor = useEditor({
		extensions: editorExtensions,
		content: initialValue,
		onUpdate({ editor }) {
			const content = editor.getJSON();
			onChange && onChange(content);
		},
	});

	return (
		<EditorProvider editor={editor}>
			<div className="bg-gray-100 border border-black-200/10 pt-4 rounded">
				<EditorMenu />
				<EditorContent editor={editor} className="prose max-w-full" />
			</div>
		</EditorProvider>
	);
};

EditorComponent.propTypes = {
	initialValue: propTypes.object,
	onChange: propTypes.func,
};

const Editor = memo(EditorComponent);
export default Editor;
