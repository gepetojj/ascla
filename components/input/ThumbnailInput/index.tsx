import {
	Dropzone,
	FileDuiResponse,
	FileItem,
	FileValidated,
	FullScreenPreview,
} from "@dropzone-ui/react";
import { Dialog } from "@headlessui/react";

import propTypes from "prop-types";
import React, { FC, memo, useCallback, useState } from "react";
import { MdDone } from "react-icons/md";
import { Store } from "react-notifications-component";

import { Button } from "../Button";

export interface ThumbnailInputProps {
	/** ID do botão. */
	id: string;
	/** Determina o avatar. */
	setThumbnail: (thumbnail: string) => void;
}

/**
 * Renderiza um botão que ativa um modal, com um editor de avatar.
 *
 * @see {@link ThumbnailInputProps}
 *
 * @param {ThumbnailInputProps} ...props Props do componente, desestruturadas
 * @returns {FC<ThumbnailInputProps>} Componente
 */
const ThumbnailInputComponent: FC<ThumbnailInputProps> = ({ id, setThumbnail }) => {
	const [isOpen, setOpen] = useState(false);
	const [files, setFiles] = useState<FileValidated[]>([]);
	const [imageLink, setImageLink] = useState("");

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

	return (
		<>
			<Dialog
				open={isOpen}
				onClose={() => setOpen(false)}
				className="flex fixed justify-center items-center inset-0 w-full h-full p-4 bg-black-200/20 backdrop-blur-[2px] z-20"
			>
				<div className="flex justify-center items-center max-w-lg bg-cream-100 border border-black-200/20 shadow-sm rounded">
					<Dialog.Panel className="flex flex-col p-4 gap-4">
						<div>
							<Dialog.Title className="text-2xl font-bold">
								Inserir imagem de capa
							</Dialog.Title>
							<Dialog.Description className="text-sm text-black-300">
								Esta imagem será mostrada na lista de postagens da categoria,
								podendo ser do blog ou das notícias. As dimensões da imagem devem
								ser 300x150px.
							</Dialog.Description>
						</div>
						<div className="flex flex-col justify-center items-center gap-10 sm:flex-row">
							<Dropzone
								value={files}
								onChange={onUpdateFiles}
								onUploadFinish={onUploadFinish}
								accept="image/*"
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
								<FullScreenPreview />
							</Dropzone>
						</div>
						<Button
							className="bg-primary-main"
							onClick={() => {
								if (!imageLink) {
									Store.addNotification({
										title: "Erro",
										message: "Faça upload de alguma imagem.",
										type: "danger",
										container: "bottom-right",
										dismiss: {
											duration: 5000,
											onScreen: true,
										},
									});
									return;
								}
								setThumbnail(imageLink);
								setOpen(false);
							}}
							fullWidth
						>
							Salvar
						</Button>
					</Dialog.Panel>
				</div>
			</Dialog>

			<div className="flex flex-col gap-1 w-full sm:w-60">
				<label htmlFor={id} className="text-xs text-black-300 font-medium ml-1">
					Insira uma imagem de capa:
				</label>
				<Button
					id={id}
					className="text-cream-100 bg-secondary-800 py-1 border border-secondary-800 relative"
					onClick={() => setOpen(true)}
					fullWidth
				>
					{!!imageLink ? "Alterar imagem" : "Insira uma imagem"}
					{!!imageLink && <MdDone className="absolute right-2 text-xl" />}
				</Button>
			</div>
		</>
	);
};

ThumbnailInputComponent.propTypes = {
	id: propTypes.string.isRequired,
	setThumbnail: propTypes.func.isRequired,
};

export const ThumbnailInput = memo(ThumbnailInputComponent);
