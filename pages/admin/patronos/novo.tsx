import type { JSONContent } from "@tiptap/react";

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
	const [academicId, setAcademicId] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	// Lista os acadêmicos para mostrar na seleção
	useEffect(() => {
		data && !error && setAcademics(data.academics);
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
			if (!name || !academicId || !editorContent.content?.length) {
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

			fetcher({ name, academicId, bio: editorContent });
		},
		[fetcher, name, academicId, editorContent]
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
					<select
						className="w-full sm:w-80"
						defaultValue=""
						onChange={event => setAcademicId(event.target.value)}
						disabled={!!academics && academics.length <= 0}
					>
						<option value="">Escolha um acadêmico.</option>
						{!!academics && !!academics.length ? (
							academics.map(academic => (
								<option key={academic.id} value={academic.id}>
									{academic.name}
								</option>
							))
						) : (
							<option value="">Não há acadêmicos registrados.</option>
						)}
					</select>
				</>
			</AdminForm>
		</>
	);
};

export default AdminPatronsNew;
