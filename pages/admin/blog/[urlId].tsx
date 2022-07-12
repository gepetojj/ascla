import type { JSONContent } from "@tiptap/core";

import { TextInput } from "components/input/TextInput";
import { ThumbnailInput } from "components/input/ThumbnailInput";
import { AdminForm } from "components/layout/AdminForm";
import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage, GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Store } from "react-notifications-component";

interface Props {
	post: BlogPost;
}

const AdminPostEdit: NextPage<Props> = ({ post }) => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>("/api/blog/update", "put");

	const [title, setTitle] = useState(post.title);
	const [description, setDescription] = useState(post.description);
	const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnailUrl || "");
	const [editorContent, setEditorContent] = useState<JSONContent>(post.content);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Postagem atualizada com sucesso.",
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
				message: `Não foi possível editar a postagem. ${
					err?.message ? `Motivo: ${err.message}` : ""
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

			fetcher({ id: post.id, title, description, thumbnailUrl, content: editorContent });
		},
		[fetcher, post.id, title, description, thumbnailUrl, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Blog - Editar" noindex nofollow />

			<AdminForm
				title="Editar postagem"
				onFormSubmit={onFormSubmit}
				submitLabel="Editar"
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
						onChange={({ target }) => setTitle(target.value)}
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
					<ThumbnailInput id="thumbnail" setThumbnail={setThumbnailUrl} />
				</>
			</AdminForm>
		</>
	);
};

export default AdminPostEdit;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "blogPosts", ensure: { query: ["urlId"] }, autoTry: true },
		async col => {
			const query = await col.where("metadata.urlId", "==", ctx.query.urlId).get();
			const post = query.docs[0];

			if (query.empty || !post.exists) return { notFound: true };

			const data = post.data() as BlogPost;
			return { props: { post: data } };
		}
	);
