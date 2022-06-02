import {
	Input,
	Tab,
	Tabs,
	TabsBody,
	TabsHeader,
	TabPanel,
	Button,
	Select,
	Option,
} from "@material-tailwind/react";
import { JSONContent } from "@tiptap/react";

import { Editor } from "components/input/Editor";
import { PatronView } from "components/view/Patron";
import type { Academic } from "entities/Academic";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useState, FormEvent, useEffect } from "react";

const AdminPatronsNew: NextPage = () => {
	const [academics, setAcademics] = useState<Academic[]>([]);

	const [name, setName] = useState("");
	const [academicId, setAcademicId] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
	});

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

			fetch("/api/patrons/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					academicId,
					bio: editorContent,
				}),
			})
				.then(async res => {
					if (res.ok) return alert("Patrono criado com sucesso.");

					const data = await res.json();
					console.error(res.status, data);
					alert("Falha.");
				})
				.catch(() => {
					alert("Falha.");
				});
		},
		[name, academicId, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Patronos - Novo</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Novo patrono</h1>
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
									disabled={academics.length <= 0}
								>
									{!!academics.length ? (
										academics.map(academic => (
											<Option
												key={academic.id}
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
								<PatronView
									name={name || "Nome do patrono"}
									bio={editorContent}
									metadata={{
										urlId: "",
										createdAt: 0,
										updatedAt: 0,
										academicId,
									}}
								/>
							</TabPanel>
						</TabsBody>
					</Tabs>
				</form>
			</main>
		</>
	);
};

export default AdminPatronsNew;
