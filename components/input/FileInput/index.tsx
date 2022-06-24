import { Dialog } from "@headlessui/react";

import dynamic from "next/dynamic";
import Image from "next/image";
import propTypes from "prop-types";
import React, { ChangeEvent, FC, memo, useCallback, useState } from "react";
import { MdDone } from "react-icons/md";
import { Store } from "react-notifications-component";

import { Button } from "../Button";

export interface FileInputProps {
	/** ID do botão. */
	id: string;
	/** Texto que aparecerá acima do botão. */
	label?: string;
	/** String base64 do avatar. */
	avatar?: string;
	/** Determina o avatar. */
	setAvatar: (avatar: string) => void;
}

const DynamicAvatar = dynamic(() => import("react-avatar-edit"), { ssr: false });

/**
 * Renderiza um botão que ativa um modal, com um editor de avatar.
 *
 * @see {@link FileInputProps}
 *
 * @param {FileInputProps} ...props Props do componente, desestruturadas
 * @returns {FC<FileInputProps>} Componente
 */
const FileInputComponent: FC<FileInputProps> = ({ id, label, avatar, setAvatar }) => {
	const [isOpen, setOpen] = useState(false);
	const [preview, setPreview] = useState<string | null>(avatar || null);

	const beforeLoad = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		if (
			!event.target.files ||
			event.target.files[0].size > 5 * 1024 * 1024 ||
			event.target.files[0].size < 10
		) {
			Store.addNotification({
				title: "Erro",
				message:
					"Não foi possível carregar sua imagem. Possíveis motivos: imagem não identificada, imagem maior que o tamanho máximo ou imagem nula.",
				type: "danger",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
			event.target.value = "";
		}
	}, []);

	const onCrop = useCallback((image: string) => {
		setPreview(image);
	}, []);

	const onClose = useCallback(() => {
		setPreview(null);
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
								Inserir imagem
							</Dialog.Title>
							<Dialog.Description className="text-sm text-black-300">
								Escolha um arquivo de imagem e faça upload. O tamanho máximo aceito
								é de 5 MB, e pode ser um arquivo <i>.png, .jpg, .jpeg ou .webp</i>.
							</Dialog.Description>
						</div>
						<div className="flex flex-col justify-center items-center gap-10 sm:flex-row">
							<DynamicAvatar
								width={150}
								height={150}
								imageWidth={124}
								exportSize={124}
								exportQuality={0.5}
								mimeTypes="image/png,image/jpg,image/jpeg,image/webp"
								label="Clique aqui"
								onBeforeFileLoad={beforeLoad}
								onCrop={onCrop}
								onClose={onClose}
							/>
							<div className="flex flex-col justify-center items-center gap-1 px-4 py-1 border border-black-300/50 rounded">
								<span className="text-xs">Pré-visualização:</span>
								<Image
									src={preview || "/images/usuario-padrao.webp"}
									alt="Pré-visualização do avatar"
									width={124}
									height={124}
									layout="fixed"
									className="rounded-full"
								/>
							</div>
						</div>
						<Button
							className="bg-primary-main"
							onClick={() => {
								if (!preview) {
									Store.addNotification({
										title: "Erro",
										message: "Insira uma imagem.",
										type: "danger",
										container: "bottom-right",
										dismiss: {
											duration: 5000,
											onScreen: true,
										},
									});
									return;
								}
								setAvatar(preview);
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
					{label ?? "Insira um arquivo:"}
				</label>
				<Button
					id={id}
					className="text-cream-100 bg-secondary-800 py-1 border border-secondary-800 relative"
					onClick={() => setOpen(true)}
					fullWidth
				>
					{avatar ? "Alterar imagem" : "Insira uma imagem"}
					{avatar && <MdDone className="absolute right-2 text-xl" />}
				</Button>
			</div>
		</>
	);
};

FileInputComponent.propTypes = {
	id: propTypes.string.isRequired,
	label: propTypes.string,
	avatar: propTypes.string,
	setAvatar: propTypes.func.isRequired,
};

export const FileInput = memo(FileInputComponent);
