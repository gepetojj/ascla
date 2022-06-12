import type { JSONContent } from "@tiptap/react";

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
	academic: Academic;
}

const AdminAcademicsEdit: NextPage<Props> = ({ academic }) => {
	const [patrons, setPatrons] = useState<Patron[]>([]);
	const { data, error } = useSWR("/api/patrons/list", (...args) =>
		fetch(...args).then(res => res.json())
	);
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/academics/update",
		"put"
	);

	const [name, setName] = useState(academic.name);
	const [patronId, setPatronId] = useState(academic.metadata.patronId);
	const [editorContent, setEditorContent] = useState<JSONContent>(academic.bio);

	// Lista os patronos para mostrar na seleção
	useEffect(() => {
		data && !error && setPatrons(data.patrons);
		!data && error && console.error(error);
	}, [data, error]);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Acadêmico atualizado com sucesso.",
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
				message: `Não foi possível editar o acadêmico. ${
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

			fetcher({
				id: academic.id,
				name,
				patronId,
				bio: editorContent,
			});
		},
		[fetcher, academic.id, name, patronId, editorContent]
	);

	return (
		<>
			<NextSeo title="Administração - Acadêmicos - Editar" noindex nofollow />

			<AdminForm
				title="Editar acadêmico"
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
					<select
						className="w-full sm:w-80"
						defaultValue={academic.metadata.patronId}
						onChange={event => setPatronId(event.target.value)}
						disabled={!!patrons && patrons.length <= 0}
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
				</>
			</AdminForm>
		</>
	);
};

export default AdminAcademicsEdit;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "academics", ensure: { query: ["urlId"] }, autoTry: true },
		async col => {
			const query = await col.where("metadata.urlId", "==", ctx.query.urlId).get();
			const academic = query.docs[0];

			if (query.empty || !academic.exists) return { notFound: true };

			const data = academic.data() as Academic;
			return { props: { academic: data } };
		}
	);
