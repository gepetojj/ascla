import type { JSONContent } from "@tiptap/core";

import { FileInput } from "components/input/FileInput";
import { Select } from "components/input/Select";
import { TextInput } from "components/input/TextInput";
import { AdminForm } from "components/layout/AdminForm";
import { config } from "config";
import { type Academic, type AcademicType, AcademicTypes } from "entities/Academic";
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
	useSWR("/api/patrons/list", (...args) =>
		fetch(...args).then(res =>
			res.json().then(data => {
				const list = [{ id: "nenhum", name: "Nenhum" }, ...data.patrons];
				setPatrons(list);
				!selectedPatron &&
					setSelectedPatron(
						(list as Patron[]).find(({ id }) => id === academic.metadata.patronId)
					);
				return data;
			})
		)
	);
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/academics/update",
		"put"
	);

	const [name, setName] = useState(academic.name);
	const [selectedPatron, setSelectedPatron] = useState<Patron | undefined>(undefined);
	const [chair, setChair] = useState(academic.metadata.chair || 0);
	const [type, setType] = useState<{ id: AcademicType; name: string }>(
		AcademicTypes.find(({ id }) => id === academic.metadata.type) || AcademicTypes[0]
	);
	const [avatar, setAvatar] = useState("");
	const [editorContent, setEditorContent] = useState<JSONContent>(academic.bio);

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
				(type.id === "primary" && (chair < 1 || chair > 1000)) ||
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
				id: academic.id,
				name,
				patronId:
					selectedPatron?.id === "nenhum" ? undefined : selectedPatron?.id || undefined,
				chair: type.id === "primary" ? chair : -1,
				type: type.id,
				avatar: avatar || undefined,
				bio: editorContent,
			});
		},
		[fetcher, academic.id, name, selectedPatron, chair, type, avatar, editorContent]
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
						className="w-full sm:w-[30rem]"
						value={name}
						onChange={({ target }) => setName(target.value)}
						required
					/>
					<Select
						label="Escolha um patrono"
						options={patrons}
						selected={selectedPatron}
						onChange={selected => setSelectedPatron(selected as Patron)}
					/>
					<Select
						label="Escolha o tipo *"
						options={AcademicTypes}
						selected={type}
						onChange={selected =>
							setType(selected as { id: AcademicType; name: string })
						}
					/>
					{type.id === "primary" && (
						<TextInput
							id="chair"
							label="Cadeira (necessário se tipo for 'efetivo')"
							className="w-full sm:w-60"
							type="number"
							min={1}
							max={1000}
							value={chair}
							onChange={({ target }) => setChair(Number(target.value))}
							required
						/>
					)}
					<FileInput
						id="avatar"
						label="Insira uma imagem"
						previous={academic.avatarUrl}
						avatar={avatar}
						setAvatar={setAvatar}
					/>
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
		async () => {
			const res = await fetch(`${config.basePath}/api/academics/read?id=${ctx.query.urlId}`);
			if (!res.ok) return { notFound: true };

			const data: { academic: Academic } = await res.json();
			const academic: Academic = data.academic;

			return { props: { academic } };
		}
	);
