import type { JSONContent } from "@tiptap/core";

import { FileInput } from "components/input/FileInput";
import { Select } from "components/input/Select";
import { TextInput } from "components/input/TextInput";
import { AdminForm } from "components/layout/AdminForm";
import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage, GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import useSWR from "swr";

interface Props {
	patron: Patron;
}

const AdminPatronsEdit: NextPage<Props> = ({ patron }) => {
	const [academics, setAcademics] = useState<Academic[]>([]);
	const { data, error } = useSWR("/api/academics/list", (...args) =>
		fetch(...args).then(res => res.json())
	);
	const { fetcher, events, loading } = useFetcher<DefaultResponse>("/api/patrons/update", "put");

	const [name, setName] = useState(patron.name);
	const [selectedAcademic, setSelectedAcademic] = useState<Academic | undefined>(undefined);
	const [chair, setChair] = useState(patron.metadata.chair || 0);
	const [avatar, setAvatar] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>(patron.bio);

	// Lista os acadêmicos para mostrar na seleção
	useEffect(() => {
		if (data && !error) {
			setAcademics(data.academics);
			setSelectedAcademic(academics.find(({ id }) => id === patron.metadata.academicId));
		}
	}, [academics, patron, data, error]);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Patrono atualizado com sucesso.",
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
				message: `Não foi possível editar o patrono. ${
					err?.message ? `Motivo: ${err.message}` : ""
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

			fetcher({
				id: patron.id,
				name,
				academicId: selectedAcademic.id,
				chair,
				avatar,
				bio: editorContent,
			});
		},
		[fetcher, patron.id, name, selectedAcademic, chair, avatar, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Patronos - Editar" noindex nofollow />

			<AdminForm
				title="Editar patrono"
				onFormSubmit={onFormSubmit}
				submitLabel="Editar"
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
						previous={patron.avatarUrl}
						avatar={avatar}
						setAvatar={setAvatar}
					/>
				</>
			</AdminForm>
		</>
	);
};

export default AdminPatronsEdit;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "patrons", ensure: { query: ["urlId"] }, autoTry: true },
		async col => {
			const query = await col.where("metadata.urlId", "==", ctx.query.urlId).get();
			const patron = query.docs[0];

			if (query.empty || !patron.exists) return { notFound: true };

			const data = patron.data() as Patron;
			return { props: { patron: data } };
		}
	);
