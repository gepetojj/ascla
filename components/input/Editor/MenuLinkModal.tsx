import { Dialog } from "@headlessui/react";

import propTypes from "prop-types";
import React, { FC, memo, useCallback, useEffect, useState } from "react";

import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { useEditor } from "./Context";

export interface MenuLinkModalProps {
	/** Determina se o modal está aberto. */
	open: boolean;
	/** Callback executado quando o usuário pede para que o modal feche. */
	onClose: () => void;
}

/**
 * Renderiza um modal com opções para adicionar links.
 *
 * @see {@link MenuLinkModalProps}
 *
 * @param {MenuLinkModalProps} ...props Props desestruturados
 * @returns {FC<MenuLinkModalProps>} Componente
 */
const MenuLinkModalComponent: FC<MenuLinkModalProps> = ({ open, onClose }) => {
	const { editor } = useEditor();
	const [link, setLink] = useState<string>(editor?.getAttributes("link").href || "");

	const onClear = useCallback(() => {
		if (!editor) return;

		setLink("");
		editor.commands.unsetLink();
		onClose();
	}, [editor, onClose]);

	const onConfirm = useCallback(() => {
		if (!editor) return;

		if (link) editor.commands.setLink({ href: link, target: "_blank" });
		else editor.commands.unsetLink();

		onClose();
	}, [editor, link, onClose]);

	useEffect(() => {
		if (!editor) return;
		setLink(editor.getAttributes("link").href || "");
	}, [editor, open]);

	if (!editor) return null;

	return (
		<Dialog
			open={open}
			onClose={onClose}
			className="flex fixed justify-center items-center inset-0 w-full h-full p-4 bg-black-200/20 backdrop-blur-[2px] z-20"
		>
			<div className="flex justify-center items-center max-w-lg bg-cream-100 border border-black-200/20 shadow-sm rounded">
				<Dialog.Panel className="flex flex-col p-4 gap-4">
					<div>
						<Dialog.Title className="text-2xl font-bold">Inserir link</Dialog.Title>
						<Dialog.Description className="text-sm text-black-300">
							Complete os dados para inserir um link. Lembrete: apenas links seguros
							(https) podem ser inseridos.
						</Dialog.Description>
					</div>
					<div className="flex flex-col gap-2">
						<TextInput
							id="url"
							label="Link:"
							type="url"
							parentClassName="w-full"
							value={link}
							onChange={event => setLink(event.target.value)}
							required
						/>
						<div
							className={`flex ${
								link ? "justify-between" : "justify-end"
							} items-center w-full`}
						>
							{link && (
								<Button
									className="bg-red-500 text-cream-100 py-1.5"
									onClick={onClear}
								>
									Remover
								</Button>
							)}
							<Button className="bg-primary-main py-1.5" onClick={onConfirm}>
								Adicionar
							</Button>
						</div>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
};

MenuLinkModalComponent.propTypes = {
	open: propTypes.bool.isRequired,
	onClose: propTypes.func.isRequired,
};

export const MenuLinkModal = memo(MenuLinkModalComponent);
