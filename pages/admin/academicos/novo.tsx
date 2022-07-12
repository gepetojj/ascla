import type { JSONContent } from "@tiptap/core";

import { FileInput } from "components/input/FileInput";
import { Select } from "components/input/Select";
import { TextInput } from "components/input/TextInput";
import { AdminForm } from "components/layout/AdminForm";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import React, { useCallback, useState, FormEvent, useEffect } from "react";
import { Store } from "react-notifications-component";
import useSWR from "swr";

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
	const [selectedPatron, setSelectedPatron] = useState(patrons.find(() => false));
	const [chair, setChair] = useState(0);
	const [avatar, setAvatar] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	// Lista os patronos para mostrar na seleção
	useEffect(() => {
		data && !error && setPatrons([{ id: "nenhum", name: "Nenhum" }, ...data.patrons]);
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
			if (
				!name ||
				!selectedPatron?.id ||
				chair < 1 ||
				chair > 1000 ||
				!avatar ||
				!editorContent.content?.length
			) {
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

			fetcher({ name, patronId: selectedPatron.id, chair, avatar, bio: editorContent });
		},
		[fetcher, name, selectedPatron, chair, avatar, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Acadêmicos - Novo" noindex nofollow />

			<AdminForm
				title="Novo acadêmico"
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
						label="Escolha um patrono *"
						options={patrons}
						selected={selectedPatron}
						onChange={selected => setSelectedPatron(selected as Patron)}
					/>
					<TextInput
						id="chair"
						label="Cadeira *"
						className="w-full sm:w-32"
						type="number"
						min={1}
						max={1000}
						value={chair}
						onChange={({ target }) => setChair(Number(target.value))}
						required
					/>
					<FileInput
						id="avatar"
						label="Insira uma imagem *"
						avatar={avatar}
						setAvatar={setAvatar}
					/>
				</>
			</AdminForm>
		</>
	);
};

export default AdminAcademicsNew;
