import { Input, Button, Tabs, TabsHeader, Tab, TabsBody, TabPanel } from "@material-tailwind/react";
import { JSONContent } from "@tiptap/react";

import { Editor } from "components/input/Editor";
import { PostView } from "components/view/Post";
import type { BlogPost } from "entities/BlogPost";
import { firestore } from "myFirebase/server";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import React, { FormEvent, useCallback, useState } from "react";

interface Props {
	post: BlogPost;
}

const AdminPostEdit: NextPage<Props> = ({ post }) => {
	const [title, setTitle] = useState(post.title);
	const [description, setDescription] = useState(post.description);
	const [editorContent, setEditorContent] = useState<JSONContent>(post.content);

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!description || !editorContent.content?.length) return;

			fetch("/api/blog/post/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: post.id,
					title,
					description,
					content: editorContent,
				}),
			})
				.then(async res => {
					if (res.ok) return alert("Post atualizado com sucesso.");

					const json = await res.json();
					console.error(res.status, json);
					alert("Falha.");
				})
				.catch(() => {
					alert("Falha.");
				});
		},
		[post.id, title, description, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Blog - Editar post</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Atualizar post</h1>
				<form className="flex flex-col pt-4" onSubmit={onFormSubmit}>
					<div className="flex flex-wrap justify-between items-center w-full px-5 pb-5">
						<div className="flex flex-wrap">
							<div className="mr-2 my-2">
								<Input
									label="Título *"
									color="orange"
									className="w-80"
									value={title}
									onChange={({ target }) => setTitle(target.value)}
									required
								/>
							</div>
							<div className="mr-2 my-2">
								<Input
									label="Descrição curta *"
									color="orange"
									className="w-80"
									value={description}
									onChange={({ target }) => setDescription(target.value)}
									required
								/>
							</div>
						</div>
						<Button type="submit" color="orange">
							Atualizar
						</Button>
					</div>
					<Tabs value="editor" className="px-5">
						<TabsHeader>
							<Tab key="editor" value="editor">
								Editor
							</Tab>
							<Tab key="preview" value="preview">
								Visualizar
							</Tab>
						</TabsHeader>
						<TabsBody>
							<TabPanel key="editor" value="editor">
								<Editor initialValue={editorContent} onChange={setEditorContent} />
							</TabPanel>
							<TabPanel key="preview" value="preview">
								<PostView
									title={title || post.title}
									description={description || post.description}
									metadata={{ ...post.metadata, updatedAt: Date.now() }}
									content={editorContent}
								/>
							</TabPanel>
						</TabsBody>
					</Tabs>
				</form>
			</main>
		</>
	);
};

export default AdminPostEdit;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
	const col = firestore.collection("posts");
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
