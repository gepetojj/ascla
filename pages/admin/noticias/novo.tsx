import type { JSONContent } from "@tiptap/core";

import { TextInput } from "components/input/TextInput";
import { ThumbnailInput } from "components/input/ThumbnailInput";
import { AdminForm } from "components/layout/AdminForm";
import type { DefaultResponse } from "entities/DefaultResponse";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useCallback, useState, FormEvent, useEffect } from "react";
import { Store } from "react-notifications-component";

const AdminNewsNewPost: NextPage = () => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/posts/create?type=news",
		"post"
	);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [thumbnailUrl, setThumbnailUrl] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Notícia criada com sucesso.",
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
				message: `Não foi possível criar a notícia. ${
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

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!title || !description || !thumbnailUrl || !editorContent.content?.length) {
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

			fetcher({ title, description, thumbnailUrl, content: editorContent });
		},
		[fetcher, title, description, thumbnailUrl, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Notícias - Novo" noindex nofollow />

			<AdminForm
				title="Nova notícia"
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
						className="w-full sm:w-[30rem]"
						value={title}
						onChange={({ target }) => setTitle(target.value)}
						required
					/>
					<TextInput
						id="description"
						label="Descrição curta *"
						className="w-full sm:w-[30rem]"
						value={description}
						onChange={({ target }) => setDescription(target.value)}
						required
					/>
					<ThumbnailInput id="thumbnail" setThumbnail={setThumbnailUrl} />
				</>
			</AdminForm>
		</>
	);
};

export default AdminNewsNewPost;
