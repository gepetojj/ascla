import type { JSONContent } from "@tiptap/core";

import { TextInput } from "components/input/TextInput";
import { ThumbnailInput } from "components/input/ThumbnailInput";
import { AdminForm } from "components/layout/AdminForm";
import type { DefaultResponse } from "entities/DefaultResponse";
import { getIdFromText } from "helpers/getIdFromText";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useCallback, useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Store } from "react-notifications-component";

const AdminBlogNew: NextPage = () => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>("/api/blog/create", "post");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [customUrl, setCustomUrl] = useState("");
	const [thumbnailUrl, setThumbnailUrl] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Postagem criada com sucesso.",
				type: "success",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
		};

		const onError = (err?: DefaultResponse) => {
			Store.addNotification({
				title: "Erro",
				message: `Não foi possível criar a postagem. ${
					err?.message && `Motivo: ${err.message}`
				}`,
				type: "danger",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
		};

		events.on("success", onSuccess);
		events.on("error", onError);

		return () => {
			events.removeListener("success", onSuccess);
			events.removeListener("error", onError);
		};
	}, [events]);

	const onTitleChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
		setTitle(target.value);
		setCustomUrl(getIdFromText(target.value));
	}, []);

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (
				!title ||
				!description ||
				!thumbnailUrl ||
				!customUrl ||
				!editorContent.content?.length
			) {
				Store.addNotification({
					title: "Erro",
					message: "Preencha todos os campos corretamente.",
					type: "danger",
					container: "bottom-right",
					dismiss: {
						duration: 5000,
						onScreen: true,
					},
				});
				return;
			}

			fetcher({ title, description, thumbnailUrl, customUrl, content: editorContent });
		},
		[fetcher, title, description, thumbnailUrl, customUrl, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Blog - Novo" noindex nofollow />

			<AdminForm
				title="Nova postagem"
				onFormSubmit={onFormSubmit}
				submitLabel="Postar"
				loading={loading}
				editorContent={editorContent}
				onEditorChange={setEditorContent}
			>
				<>
					<TextInput
						id="title"
						label="Título *"
						className="w-full sm:w-80"
						value={title}
						onChange={onTitleChange}
						required
					/>
					<TextInput
						id="description"
						label="Descrição curta *"
						className="w-full sm:w-80"
						value={description}
						onChange={({ target }) => setDescription(target.value)}
						required
					/>
					<TextInput
						id="customUrl"
						label="URL Personalizada"
						className="w-full sm:w-80"
						value={customUrl}
						readOnly
					/>
					<ThumbnailInput id="thumbnail" setThumbnail={setThumbnailUrl} />
				</>
			</AdminForm>
		</>
	);
};

export default AdminBlogNew;
