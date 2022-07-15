import type { JSONContent } from "@tiptap/core";

import { FileInput } from "components/input/FileInput";
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
	const [chair, setChair] = useState(0);
	const [avatar, setAvatar] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	useEffect(() => {
		const keyboardHandler = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.code === "KeyI") {
				setName("");
				// @ts-expect-error O acadêmico abaixo não precisa ter as demais propriedades.
				setSelectedAcademic({ id: "nenhum", name: "Nenhum" });
				setChair(0);
				setAvatar("");
				setEditorContent({
					type: "doc",
					content: [{ type: "paragraph" }],
				});
			}
		};

		window.addEventListener("keypress", keyboardHandler);
		return () => window.removeEventListener("keypress", keyboardHandler);
	}, []);

	// Lista os acadêmicos para mostrar na seleção
	useEffect(() => {
		if (data && !error) {
			setAcademics([{ id: "nenhum", name: "Nenhum" }, ...data.academics]);
			setSelectedAcademic(academics.find(academic => academic.id === "nenhum"));
		}
	}, [data, error, academics]);

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

		const onError = () => {
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
				!selectedAcademic ||
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

			fetcher({ name, academicId: selectedAcademic.id, chair, avatar, bio: editorContent });
		},
		[fetcher, name, selectedAcademic, chair, avatar, editorContent]
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

export default AdminPatronsNew;
