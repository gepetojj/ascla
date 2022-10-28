import { Dropzone, FileItem, FileValidated, FileDuiResponse } from "@dropzone-ui/react";
import { Dialog, Switch } from "@headlessui/react";

import propTypes from "prop-types";
import React, { FC, memo, useCallback, useState } from "react";
import { Store } from "react-notifications-component";

import { Button } from "../Button";
import { TextInput } from "../TextInput";
import { useEditor } from "./Context";

export interface MenuImageModalProps {
	/** Determina se o modal está aberto. */
	open: boolean;
	/** Callback executado quando o usuário pede para que o modal feche. */
	onClose: () => void;
}

/**
 * Renderiza um modal com opções para adicionar imagens.
 *
 * @see {@link MenuImageModalProps}
 *
 * @param {MenuImageModalProps} ...props Props desestruturados
 * @returns {FC<MenuLinkModalProps>} Componente
 */
const MenuImageModalComponent: FC<MenuImageModalProps> = ({ open, onClose }) => {
	const { editor } = useEditor();
	const [files, setFiles] = useState<FileValidated[]>([]);
	const [imageLink, setImageLink] = useState("");
	const [isImage, setIsImage] = useState(true);

	const onUpdateFiles = useCallback((incomming: FileValidated[]) => {
		setFiles(incomming);
	}, []);

	const onUploadFinish = useCallback((responses: FileDuiResponse[]) => {
		const response = responses ? responses[0].serverResponse : null;
		// @ts-expect-error Devido a tipagem fraca da biblioteca.
		if (!responses || !response || !response.payload) return;
		// @ts-expect-error Devido a tipagem fraca da biblioteca.
		setImageLink(response.payload.link);
	}, []);

	const onConfirm = useCallback(() => {
		if (!editor || !imageLink) {
			Store.addNotification({
				title: "Erro",
				message: "Adicione o link da imagem/vídeo.",
				type: "danger",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
			return;
		}

		if (isImage) {
			editor
				.chain()
				.focus()
				.setImage({ src: imageLink, alt: "Imagem adicionada pelo editor da postagem." })
				.run();
		} else {
			imageLink.includes("youtube.com") || imageLink.includes("youtu.be")
				? editor.chain().focus().setYoutubeVideo({ src: imageLink }).run()
				: editor.chain().focus().setVideo(imageLink).run();
		}

		setFiles([]);
		setImageLink("");
		onClose();
	}, [editor, imageLink, onClose, isImage]);

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
						<Dialog.Title className="text-2xl font-bold">
							Inserir imagem/vídeo
						</Dialog.Title>
						<Dialog.Description className="text-sm text-black-300">
							Faça upload de um/a vídeo/imagem para inseri-la no editor. Você só pode
							fazer um upload por vez, e quando seu link aparecer na caixa de texto,
							clique em &quot;Adicionar&quot; (ou adicione o link diretamente).
						</Dialog.Description>
					</div>
					<div className="flex flex-col gap-2">
						<Dropzone
							value={files}
							onChange={onUpdateFiles}
							onUploadFinish={onUploadFinish}
							accept="image/*,video/*"
							maxFiles={1}
							label="Solte um arquivo aqui ou clique para escolher."
							localization="PT-pt"
							method="POST"
							url="/api/images/upload?dest=generic"
							behaviour="replace"
							color="#83CB89"
							disableScroll
							footer={false}
						>
							{files.map(file => (
								<FileItem
									key={file.id}
									{...file}
									alwaysActive
									localization="PT-pt"
									preview
									hd
									elevation={2}
									resultOnTooltip
								/>
							))}
						</Dropzone>
						<div className="flex justify-center items-center w-full gap-4">
							<span>É um vídeo</span>
							<Switch
								checked={isImage}
								onChange={setIsImage}
								className={`${
									isImage ? "bg-cyan-600" : " bg-teal-600"
								} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
							>
								<span className="sr-only">Define se é uma imagem ou vídeo.</span>
								<span
									className={`${
										isImage ? "translate-x-6" : "translate-x-1"
									} inline-block h-4 w-4 transform rounded-full bg-white duration-200`}
								/>
							</Switch>
							<span>É uma imagem</span>
						</div>
						<TextInput
							id="url"
							label="Link:"
							type="url"
							parentClassName="w-full"
							value={imageLink}
							onChange={event => setImageLink(event.target.value)}
							required
						/>
						<div className="flex justify-end items-center w-full">
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

MenuImageModalComponent.propTypes = {
	open: propTypes.bool.isRequired,
	onClose: propTypes.func.isRequired,
};

export const MenuImageModal = memo(MenuImageModalComponent);
