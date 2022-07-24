import React, { FC, memo, useCallback, useState } from "react";
import {
	MdFormatAlignCenter,
	MdFormatAlignJustify,
	MdFormatAlignLeft,
	MdFormatAlignRight,
	MdFormatBold,
	MdFormatClear,
	MdFormatItalic,
	MdFormatUnderlined,
	MdImage,
	MdLink,
	MdRedo,
	MdUndo,
} from "react-icons/md";

import { useEditor } from "./Context";
import { MenuImageModal } from "./MenuImageModal";
import { MenuLinkModal } from "./MenuLinkModal";
import { EditorMenuOption } from "./MenuOption";

/** Nível de parágrafo. */
type Level = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Renderiza o menu do editor.
 *
 * @returns {FC} Componente
 */
const EditorMenuComponent: FC = () => {
	const { editor } = useEditor();
	const [isLinkModalOpen, setLinkModalOpen] = useState(false);
	const [isImageModalOpen, setImageModalOpen] = useState(false);

	const toggleHeading = useCallback(
		(level: Level) => {
			if (!editor) return;
			editor.chain().focus().toggleHeading({ level }).run();
		},
		[editor]
	);

	if (!editor) return null;

	return (
		<>
			<MenuLinkModal open={isLinkModalOpen} onClose={() => setLinkModalOpen(false)} />
			<MenuImageModal open={isImageModalOpen} onClose={() => setImageModalOpen(false)} />
			<div className="flex flex-wrap p-2 mx-4 bg-slate-50 rounded-md gap-1">
				<div className="flex items-center">
					<EditorMenuOption
						tooltip="Desfazer"
						onClick={() => editor.chain().focus().undo().run()}
					>
						<MdUndo className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Refazer"
						onClick={() => editor.chain().focus().redo().run()}
					>
						<MdRedo className="text-xl" />
					</EditorMenuOption>
				</div>
				<div>
					<EditorMenuOption
						tooltip="Título 2"
						onClick={() => toggleHeading(2)}
						isActive={editor.isActive("heading", { level: 2 })}
					>
						H2
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Título 3"
						onClick={() => toggleHeading(3)}
						isActive={editor.isActive("heading", { level: 3 })}
					>
						H3
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Título 4"
						onClick={() => toggleHeading(4)}
						isActive={editor.isActive("heading", { level: 4 })}
					>
						H4
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Título 5"
						onClick={() => toggleHeading(5)}
						isActive={editor.isActive("heading", { level: 5 })}
					>
						H5
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Título 6"
						onClick={() => toggleHeading(6)}
						isActive={editor.isActive("heading", { level: 6 })}
					>
						H6
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Parágrafo"
						onClick={() => editor.chain().focus().setParagraph().run()}
						isActive={editor.isActive("paragraph")}
					>
						Parágrafo
					</EditorMenuOption>
				</div>
				<div className="flex items-center">
					<EditorMenuOption
						tooltip="Negrito"
						onClick={() => editor.chain().focus().toggleBold().run()}
						isActive={editor.isActive("bold")}
					>
						<MdFormatBold className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Sublinhar"
						onClick={() => editor.chain().focus().toggleUnderline().run()}
						isActive={editor.isActive("underline")}
					>
						<MdFormatUnderlined className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Itálico"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						isActive={editor.isActive("italic")}
					>
						<MdFormatItalic className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Inserir link"
						onClick={() => setLinkModalOpen(isLinkModalOpen => !isLinkModalOpen)}
						isActive={editor.isActive("link")}
					>
						<MdLink className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Inserir imagem"
						onClick={() => setImageModalOpen(isImageModalOpen => !isImageModalOpen)}
						isActive={editor.isActive("image")}
					>
						<MdImage className="text-xl" />
					</EditorMenuOption>
				</div>
				<div className="flex items-center">
					<EditorMenuOption
						tooltip="Alinhar à esquerda"
						onClick={() => editor.commands.setTextAlign("left")}
						isActive={editor.isActive({ textAlign: "left" })}
					>
						<MdFormatAlignLeft className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Alinhar ao centro"
						onClick={() => editor.commands.setTextAlign("center")}
						isActive={editor.isActive({ textAlign: "center" })}
					>
						<MdFormatAlignCenter className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Alinhar à direita"
						onClick={() => editor.commands.setTextAlign("right")}
						isActive={editor.isActive({ textAlign: "right" })}
					>
						<MdFormatAlignRight className="text-xl" />
					</EditorMenuOption>
					<EditorMenuOption
						tooltip="Justificar"
						onClick={() => editor.commands.setTextAlign("justify")}
						isActive={editor.isActive({ textAlign: "justify" })}
					>
						<MdFormatAlignJustify className="text-xl" />
					</EditorMenuOption>
				</div>
				<EditorMenuOption
					tooltip="Limpar formatação"
					onClick={() => {
						editor.chain().focus().clearNodes().run();
						editor.chain().focus().unsetAllMarks().run();
					}}
				>
					<MdFormatClear className="text-xl" />
				</EditorMenuOption>
			</div>
		</>
	);
};

export const EditorMenu = memo(EditorMenuComponent);
