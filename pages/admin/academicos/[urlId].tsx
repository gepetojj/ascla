import type { JSONContent } from "@tiptap/react";

import { Button } from "components/input/Button";
// import { AcademicView } from "components/view/Academic";
import type { Academic } from "entities/Academic";
import type { Patron } from "entities/Patron";
import { useFetcher } from "hooks/useFetcher";
import { Collections } from "myFirebase/enums";
import type { NextPage, GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import useSWR from "swr";

interface Props {
	academic: Academic;
}

const DynamicEditor = dynamic(() => import("components/input/Editor"));

const AdminAcademicsEdit: NextPage<Props> = ({ academic }) => {
	const [patrons, setPatrons] = useState<Patron[]>([]);
	const { data, error } = useSWR("/api/patrons/list", (...args) =>
		fetch(...args).then(res => res.json())
	);
	const updateAcademic = useFetcher("/api/academics/update", "put");

	const [name, setName] = useState(academic.name);
	const [patronId, setPatronId] = useState(academic.metadata.patronId);
	const [editorContent, setEditorContent] = useState<JSONContent>(academic.bio);

	// Lista os patronos para mostrar na seleção
	useEffect(() => {
		data && !error && setPatrons(data.patrons);
		!data && error && console.error(error);
	}, [data, error]);

	useEffect(() => {
		if (!updateAcademic.loading && updateAcademic.error) {
			alert("Houve um erro ao tentar atualizar o acadêmico.");
			console.error(updateAcademic.errorData);
		}

		if (!updateAcademic.loading && updateAcademic.data) {
			alert("Acadêmico atualizado com sucesso.");
		}
	}, [updateAcademic]);

	const onFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!name || !patronId || !editorContent.content?.length) return;

			updateAcademic.fetcher({
				id: academic.id,
				name,
				patronId,
				bio: editorContent,
			});
		},
		[updateAcademic, academic.id, name, patronId, editorContent]
	);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Acadêmicos - Editar</title>
			</Head>

			<main className="flex flex-col h-screen pt-4">
				<h1 className="text-2xl text-center font-bold">Atualizar acadêmico</h1>
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
									value={academic.metadata.patronId}
									disabled={!!patrons && patrons.length <= 0}
								>
									{!!patrons && !!patrons.length ? (
										patrons.map(patron => (
											<option
												key={patron.id}
												value={patron.id}
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
						<Button className="bg-primary-400" type="submit">
							Atualizar
						</Button>
					</div>
					<DynamicEditor initialValue={editorContent} onChange={setEditorContent} />
					{/* <AcademicView
								name={name || academic.name}
								bio={editorContent || academic.bio}
								metadata={{ ...academic.metadata, updatedAt: Date.now() }}
							/> */}
				</form>
			</main>
		</>
	);
};

export default AdminAcademicsEdit;

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
	const col = Collections.academics;
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
