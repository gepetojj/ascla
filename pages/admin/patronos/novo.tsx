import type { JSONContent } from "@tiptap/react";

import { Select } from "components/input/Select";
import { TextInput } from "components/input/TextInput";
import { AdminForm } from "components/layout/AdminForm";
import type { Academic } from "entities/Academic";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useCallback, useState, FormEvent, useEffect } from "react";
import { Store } from "react-notifications-component";
import useSWR from "swr";

const AdminPatronsNew: NextPage = () => {
	const [academics, setAcademics] = useState<Academic[]>([]);
	const { data, error } = useSWR("/api/academics/list", (...args) =>
		fetch(...args).then(res => res.json())
	);
	const { fetcher, events, loading } = useFetcher("/api/patrons/create", "post");

	const [name, setName] = useState("");
	const [selectedAcademic, setSelectedAcademic] = useState(academics.find(() => false));
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	// Lista os acadêmicos para mostrar na seleção
	useEffect(() => {
		data && !error && setAcademics([{ id: "nenhum", name: "Nenhum" }, ...data.academics]);
		!data && error && console.error(error);
	}, [data, error]);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Patrono registrado com sucesso.",
				type: "success",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
		};

		const onError = (err: unknown) => {
			Store.addNotification({
				title: "Erro",
				message: "Não foi possível criar o patrono.",
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
			if (!name || !selectedAcademic || !editorContent.content?.length) {
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

			fetcher({ name, academicId: selectedAcademic.id, bio: editorContent });
		},
		[fetcher, name, selectedAcademic, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Patronos - Novo" noindex nofollow />

			<AdminForm
				title="Novo patrono"
				onFormSubmit={onFormSubmit}
				submitLabel="Criar"
				loading={loading}
				editorContent={editorContent}
				onEditorChange={setEditorContent}
			>
				<>
					<TextInput
						id="name"
						label="Nome *"
						className="w-full sm:w-80"
						value={name}
						onChange={({ target }) => setName(target.value)}
						required
					/>
					<Select
						label="Escolha um acadêmico *"
						options={academics}
						selected={selectedAcademic}
						onChange={selected => setSelectedAcademic(selected as Academic)}
					/>
				</>
			</AdminForm>
		</>
	);
};

export default AdminPatronsNew;
