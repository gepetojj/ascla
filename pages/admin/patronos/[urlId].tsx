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
import { PatronView } from "components/view/Patron";
import type { Academic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import { firestore } from "myFirebase/server";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

interface Props {
	patron: Patron;
}

const AdminPatronsEdit: NextPage<Props> = ({ patron }) => {
	const [academics, setAcademics] = useState<Academic[]>([]);

	const [name, setName] = useState(patron.name);
	const [academicId, setAcademicId] = useState(patron.metadata.academicId);
	const [editorContent, setEditorContent] = useState<JSONContent>(patron.bio);

	// Lista os acadêmicos para mostrar na seleção
	useEffect(() => {
		fetch("/api/academics/list", {
			method: "GET",
			headers: { Accept: "application/json" },
		})
			.then(async res => {
				const data = await res.json();
				if (res.ok) {
					setAcademics(data.academics as Academic[]);
					return;
				}

				console.error(res.status, data);
				alert("Falha ao listar os acadêmicos.");
			})
			.catch(() => {
				alert("Falha ao listar os acadêmicos.");
			});
	}, []);

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!name || !academicId || !editorContent.content?.length) return;

			fetch("/api/patrons/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: patron.id,
					name,
					academicId,
					bio: editorContent,
				}),
			})
				.then(async res => {
					if (res.ok) return alert("Patrono atualizado com sucesso.");

					const json = await res.json();
					console.error(res.status, json);
					alert("Falha.");
				})
				.catch(() => {
					alert("Falha.");
				});
		},
		[patron.id, name, academicId, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Patronos - Editar</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Atualizar patrono</h1>
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
										academics.length <= 0
											? "Não há acadêmicos registrados"
											: "Vincule a um acadêmico *"
									}
									color="orange"
									className="w-80"
									value={patron.metadata.academicId}
									disabled={academics.length <= 0}
								>
									{!!academics.length ? (
										academics.map(academic => (
											<Option
												key={academic.id}
												value={academic.id}
												onClick={() => setAcademicId(academic.id)}
											>
												{academic.name}
											</Option>
										))
									) : (
										<Option disabled>Não há acadêmicos registrados.</Option>
									)}
								</Select>
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
								<PatronView
									name={name || patron.name}
									bio={editorContent || patron.bio}
									metadata={{ ...patron.metadata, updatedAt: Date.now() }}
								/>
							</TabPanel>
						</TabsBody>
					</Tabs>
				</form>
			</main>
		</>
	);
};

export default AdminPatronsEdit;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
	const col = firestore.collection("patrons");
	const urlId = query.urlId;

	if (!urlId || typeof urlId !== "string") return { notFound: true };

	try {
		const query = await col.where("metadata.urlId", "==", urlId).get();
		const patron = query.docs[0];
		if (query.empty || !patron) return { notFound: true };

		return { props: { patron: patron.data() as Patron } };
	} catch (err) {
		console.error(err);
		return { notFound: true };
	}
};