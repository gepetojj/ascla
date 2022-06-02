import { Input, Tab, Tabs, TabsBody, TabsHeader, TabPanel, Button } from "@material-tailwind/react";
import type { JSONContent } from "@tiptap/react";

import { Editor } from "components/input/Editor";
import { PostView } from "components/view/Post";
import { getIdFromText } from "helpers/getIdFromText";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useState, FormEvent, ChangeEvent } from "react";

const AdminNewPost: NextPage = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [customUrl, setCustomUrl] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
	});

	const onTitleChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
		setTitle(target.value);
		setCustomUrl(getIdFromText(target.value));
	}, []);

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!title || !description || !customUrl || !editorContent.content?.length) return;

			fetch("/api/blog/post/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					description,
					customUrl,
					content: editorContent,
				}),
			})
				.then(async res => {
					if (res.ok) return alert("Post criado com sucesso.");

					const json = await res.json();
					console.error(res.status, json);
					alert("Falha.");
				})
				.catch(() => {
					alert("Falha.");
				});
		},
		[title, description, customUrl, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Blog - Novo</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Novo post</h1>
				<form className="flex flex-col pt-4" onSubmit={onFormSubmit}>
					<div className="flex flex-wrap justify-between items-center w-full px-5 pb-5">
						<div className="flex flex-wrap">
							<div className="mr-2 my-2">
								<Input
									label="Título *"
									color="orange"
									className="w-80"
									value={title}
									onChange={onTitleChange}
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
							<div className="mr-2 my-2">
								<Input
									label="URL Personalizada"
									color="orange"
									className="w-80"
									value={customUrl}
									readOnly
								/>
							</div>
						</div>
						<Button type="submit" color="orange">
							Postar
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
									title={title || "Título"}
									description={description || "Descrição"}
									metadata={{
										urlId: customUrl,
										createdAt: Date.now(),
										updatedAt: 0,
										authorId: "Ainda não postado.",
									}}
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

export default AdminNewPost;
