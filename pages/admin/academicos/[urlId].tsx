import {
	Input,
	Button,
	Tabs,
	TabsHeader,
	Tab,
	TabsBody,
	TabPanel,
	Select,
	Option,
} from "@material-tailwind/react";
import { JSONContent } from "@tiptap/react";

import { Editor } from "components/input/Editor";
import { AcademicView } from "components/view/Academic";
import type { Academic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import { firestore } from "myFirebase/server";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

interface Props {
	academic: Academic;
}

const AdminAcademicsEdit: NextPage<Props> = ({ academic }) => {
	const [patrons, setPatrons] = useState<Patron[]>([]);

	const [name, setName] = useState(academic.name);
	const [patronId, setPatronId] = useState(academic.metadata.patronId);
	const [editorContent, setEditorContent] = useState<JSONContent>(academic.bio);

	// Lista os patronos para mostrar na seleção
	useEffect(() => {
		fetch("/api/patrons/list", {
			method: "GET",
			headers: { Accept: "application/json" },
		})
			.then(async res => {
				const data = await res.json();
				if (res.ok) {
					setPatrons(data.patrons as Patron[]);
					return;
				}

				console.error(res.status, data);
				alert("Falha ao listar os patronos.");
			})
			.catch(() => {
				alert("Falha ao listar os patronos.");
			});
	}, []);

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!name || !patronId || !editorContent.content?.length) return;

			fetch("/api/academics/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: academic.id,
					name,
					patronId,
					bio: editorContent,
				}),
			})
				.then(async res => {
					if (res.ok) return alert("Acadêmico atualizado com sucesso.");

					const json = await res.json();
					console.error(res.status, json);
					alert("Falha.");
				})
				.catch(() => {
					alert("Falha.");
				});
		},
		[academic.id, name, patronId, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Acadêmicos - Editar</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Novo acadêmico</h1>
				<form className="flex flex-col pt-4" onSubmit={onFormSubmit}>
					<div className="flex flex-wrap justify-between items-center w-full px-5 pb-5">
						<div className="flex flex-wrap">
							<div className="mr-2 my-2">
								<Input
									label="Nome *"
									color="orange"
									className="w-80"
									value={name}
									onChange={({ target }) => setName(target.value)}
									required
								/>
							</div>
							<div className="mr-2 my-2">
								<Select
									label={
										patrons.length <= 0
											? "Não há patronos registrados"
											: "Vincule a um patrono *"
									}
									color="orange"
									className="w-80"
									value={academic.metadata.patronId}
									disabled={patrons.length <= 0}
								>
									{!!patrons.length ? (
										patrons.map(patron => (
											<Option
												key={patron.id}
												value={patron.id}
												onClick={() => setPatronId(patron.id)}
											>
												{patron.name}
											</Option>
										))
									) : (
										<Option disabled>Não há patronos registrados.</Option>
									)}
								</Select>
							</div>
						</div>
						<Button type="submit" color="orange">
							Criar
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
								<AcademicView
									name={name || academic.name}
									bio={editorContent || academic.bio}
									metadata={{ ...academic.metadata, updatedAt: Date.now() }}
								/>
							</TabPanel>
						</TabsBody>
					</Tabs>
				</form>
			</main>
		</>
	);
};

export default AdminAcademicsEdit;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
	const col = firestore.collection("academics");
	const urlId = query.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const academic = query.docs[0];
		if (query.empty || !academic) return { notFound: true };

		return { props: { academic: academic.data() as Academic } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};
