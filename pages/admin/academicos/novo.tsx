import type { JSONContent } from "@tiptap/react";

import { Button } from "components/input/Button";
import type { DefaultResponse } from "entities/DefaultResponse";
// import { AcademicView } from "components/view/Academic";
import type { Patron } from "entities/Patron";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useCallback, useState, FormEvent, useEffect } from "react";
import { Store } from "react-notifications-component";
import useSWR from "swr";

const DynamicEditor = dynamic(() => import("components/input/Editor"));

const AdminAcademicsNew: NextPage = () => {
	const [patrons, setPatrons] = useState<Patron[]>([]);
	const { data, error } = useSWR("/api/patrons/list", (...args) =>
		fetch(...args).then(res => res.json())
	);
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/academics/create",
		"post"
	);

	const [name, setName] = useState("");
	const [patronId, setPatronId] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	// Lista os patronos para mostrar na seleção
	useEffect(() => {
		data && !error && setPatrons(data.patrons || []);
		!data && error && console.error(error);
	}, [data, error]);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Acadêmico registrado com sucesso.",
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
				message: `Não foi possível criar o acadêmico. ${
					err?.message && `Motivo: ${err.message}`
				}`,
				type: "danger",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
			console.error(err);
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
			if (!name || !patronId || !editorContent.content?.length) {
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

			fetcher({ name, patronId, bio: editorContent });
		},
		[fetcher, name, patronId, editorContent]
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
								<select
									className="w-80"
									disabled={!!patrons && patrons.length <= 0}
									defaultValue={""}
									onChange={event => setPatronId(event.target.value)}
								>
									<option value="">Escolha um patrono</option>
									{!!patrons && !!patrons.length ? (
										patrons.map(patron => (
											<option key={patron.id} value={patron.id}>
												{patron.name}
											</option>
										))
									) : (
										<option value="">Não há patronos registrados.</option>
									)}
								</select>
							</div>
						</div>
						<Button className="bg-primary-400" type="submit" loading={loading}>
							Criar
						</Button>
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
