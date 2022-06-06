import type { JSONContent } from "@tiptap/react";

import { Button } from "components/input/Button";
// import { AcademicView } from "components/view/Academic";
import type { Patron } from "entities/Patron";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useCallback, useState, FormEvent, useEffect } from "react";

const DynamicEditor = dynamic(() => import("components/input/Editor"));

const AdminAcademicsNew: NextPage = () => {
	const [patrons, setPatrons] = useState<Patron[]>([]);

	const [name, setName] = useState("");
	const [patronId, setPatronId] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
	});

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

			fetch("/api/academics/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					patronId,
					bio: editorContent,
				}),
			})
				.then(async res => {
					if (res.ok) return alert("Acadêmico criado com sucesso.");

					const data = await res.json();
					console.error(res.status, data);
					alert("Falha.");
				})
				.catch(() => {
					alert("Falha.");
				});
		},
		[name, patronId, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Acadêmicos - Novo</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Novo acadêmico</h1>
				<form className="flex flex-col pt-4" onSubmit={onFormSubmit}>
					<div className="flex flex-wrap justify-between items-center w-full px-5 pb-5">
						<div className="flex flex-wrap">
							<div className="mr-2 my-2">
								<input
									placeholder="Nome *"
									className="w-80"
									value={name}
									onChange={({ target }) => setName(target.value)}
									required
								/>
							</div>
							<div className="mr-2 my-2">
								<select className="w-80" disabled={patrons.length <= 0}>
									{!!patrons.length ? (
										patrons.map(patron => (
											<option
												key={patron.id}
												onClick={() => setPatronId(patron.id)}
											>
												{patron.name}
											</option>
										))
									) : (
										<option>Não há patronos registrados.</option>
									)}
								</select>
							</div>
						</div>
						<Button type="submit">Criar</Button>
					</div>
					<DynamicEditor initialValue={editorContent} onChange={setEditorContent} />
					{/* <AcademicView
						name={name || "Nome do acadêmico"}
						bio={editorContent}
						metadata={{
							urlId: "",
							createdAt: 0,
							updatedAt: 0,
							patronId,
						}}
					/> */}
				</form>
			</main>
		</>
	);
};

export default AdminAcademicsNew;
