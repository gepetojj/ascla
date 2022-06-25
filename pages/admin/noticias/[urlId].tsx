import type { JSONContent } from "@tiptap/react";

import { TextInput } from "components/input/TextInput";
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
	news: BlogPost;
}

const AdminNewsEdit: NextPage<Props> = ({ news }) => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>("/api/news/update", "put");

	const [title, setTitle] = useState(news.title);
	const [description, setDescription] = useState(news.description);
	const [editorContent, setEditorContent] = useState<JSONContent>(news.content);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Notícia atualizada com sucesso.",
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
				message: `Não foi possível editar a notícia. ${
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
			if (!description || !editorContent.content?.length) {
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

			fetcher({ id: news.id, title, description, content: editorContent });
		},
		[fetcher, news.id, title, description, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Notícias - Editar" noindex nofollow />

			<AdminForm
				title="Editar notícia"
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
				</>
			</AdminForm>
		</>
	);
};

export default AdminNewsEdit;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "news", ensure: { query: ["urlId"] }, autoTry: true },
		async col => {
			const query = await col.where("metadata.urlId", "==", ctx.query.urlId).get();
			const news = query.docs[0];

			if (query.empty || !news.exists) return { notFound: true };

			const data = news.data() as BlogPost;
			return { props: { news: data } };
		}
	);
