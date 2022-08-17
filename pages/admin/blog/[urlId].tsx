import type { JSONContent } from "@tiptap/core";

import { TextInput } from "components/input/TextInput";
import { ThumbnailInput } from "components/input/ThumbnailInput";
import { AdminForm } from "components/layout/AdminForm";
import { config } from "config";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Post } from "entities/Post";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage, GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Store } from "react-notifications-component";

interface Props {
	post: Post;
}

const AdminPostEdit: NextPage<Props> = ({ post }) => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/posts/update?type=blogPosts",
		"put"
	);

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

export default AdminPostEdit;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "blogPosts", ensure: { query: ["urlId"] }, autoTry: true },
		async () => {
			const res = await fetch(
				`${config.basePath}/api/posts/read?urlId=${ctx.query.urlId}&type=blogPosts`
			);
			if (!res.ok) return { notFound: true };

			const data: { post: Post } = await res.json();
			const post: Post = data.post;

			return { props: { post } };
		}
	);
