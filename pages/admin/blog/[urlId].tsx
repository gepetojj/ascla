import type { JSONContent } from "@tiptap/react";

import { Button } from "components/input/Button";
// import { PostView } from "components/view/Post";
import type { BlogPost } from "entities/BlogPost";
import { useFetcher } from "hooks/useFetcher";
import { Collections } from "myFirebase/enums";
import type { NextPage, GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

interface Props {
	post: BlogPost;
}

const DynamicEditor = dynamic(() => import("components/input/Editor"));

const AdminPostEdit: NextPage<Props> = ({ post }) => {
	const { data, error, loading, errorData, fetcher } = useFetcher("/api/blog/post/update", "put");

	const [title, setTitle] = useState(post.title);
	const [description, setDescription] = useState(post.description);
	const [editorContent, setEditorContent] = useState<JSONContent>(post.content);

	useEffect(() => {
		if (!loading && error) {
			alert("Não foi possível atualizar o post.");
			console.error(errorData);
		}

		if (!loading && data) {
			alert("Post atualizado com sucesso.");
		}
	}, [loading, error, errorData, data]);

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!description || !editorContent.content?.length) return;

			fetcher({ id: post.id, title, description, content: editorContent });
		},
		[fetcher, post.id, title, description, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Blog - Editar post</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Editar post</h1>
				<form className="flex flex-col pt-4" onSubmit={onFormSubmit}>
					<div className="flex flex-wrap justify-between items-center w-full px-5 pb-5">
						<div className="flex flex-wrap">
							<div className="mr-2 my-2">
								<input
									placeholder="Título *"
									className="w-80"
									value={title}
									onChange={({ target }) => setTitle(target.value)}
									required
								/>
							</div>
							<div className="mr-2 my-2">
								<input
									placeholder="Descrição curta *"
									className="w-80"
									value={description}
									onChange={({ target }) => setDescription(target.value)}
									required
								/>
							</div>
						</div>
						<Button className="bg-primary-400" type="submit">
							Atualizar
						</Button>
					</div>
					<DynamicEditor initialValue={editorContent} onChange={setEditorContent} />
					{/* <PostView
						title={title || post.title}
						description={description || post.description}
						metadata={{ ...post.metadata, updatedAt: Date.now() }}
						content={editorContent}
					/> */}
				</form>
			</main>
		</>
	);
};

export default AdminPostEdit;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
	const col = Collections.posts;
	const urlId = query.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const post = query.docs[0];
		if (query.empty || !post) return { notFound: true };

		return { props: { post: post.data() as BlogPost } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};
