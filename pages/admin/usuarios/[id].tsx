import { Select } from "components/input/Select";
import { TextInput } from "components/input/TextInput";
import { AdminForm } from "components/layout/AdminForm";
import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { User } from "entities/User";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { NextPage, GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import useSWR from "swr";

interface Props {
	user: User;
}

const AdminUsersEdit: NextPage<Props> = ({ user }) => {
	const [academics, setAcademics] = useState<Academic[]>([]);
	const { data, error } = useSWR("/api/academics/list", (...args) =>
		fetch(...args).then(res => res.json())
	);
	const { fetcher, events, loading } = useFetcher<DefaultResponse>("/api/users/update", "put");

	const [roles] = useState([
		{ id: "common", name: "Normal" },
		{ id: "academic", name: "Acadêmico" },
		{ id: "admin", name: "Administrador" },
	]);
	const [role, setRole] = useState<{ id: string; name: string } | undefined>(
		roles.find(role => role.id === user.metadata.role)
	);
	const [academic, setAcademic] = useState<Academic>();

	// Lista os acadêmicos para mostrar na seleção
	useEffect(() => {
		if (data && !error) {
			setAcademics(data.academics);
			setAcademic(academics.find(({ id }) => id === user.metadata.academicId));
		}
	}, [user.metadata.academicId, academics, data, error]);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Usuário atualizado com sucesso.",
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
				message: `Não foi possível editar o usuário. ${
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
			if (!role?.id || (role.id !== "common" && !academic?.id)) {
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
				id: user.id,
				role: role.id,
				academicId: academic?.id,
			});
		},
		[fetcher, user.id, role, academic]
	);

	return (
		<>
			<NextSeo title="Administração - Usuários - Editar" noindex nofollow />

			<AdminForm
				title="Editar usuário"
				onFormSubmit={onFormSubmit}
				submitLabel="Editar"
				loading={loading}
				noEditor
			>
				<>
					<TextInput id="name" label="Nome do usuário" value={user.name} readOnly />
					<Select
						label="Escolha um cargo *"
						options={roles}
						selected={roles.find(roleTest => roleTest === role)}
						onChange={selected => setRole(selected)}
					/>
					{(role?.id === "academic" || role?.id === "admin") && (
						<div className="flex flex-col gap-1">
							<Select
								label="Escolha o nome do acadêmico *"
								options={academics}
								selected={academic}
								onChange={academic => setAcademic(academic as Academic)}
							/>
							<span className="text-xs text-black-300 pl-1 break-words sm:w-80">
								Acadêmicos e Administradores devem ter uma página de acadêmico, é
								essa que deve ser escolhida.
							</span>
						</div>
					)}
				</>
			</AdminForm>
		</>
	);
};

export default AdminUsersEdit;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(
		ctx,
		{ col: "users", ensure: { query: ["id"] }, autoTry: true },
		async col => {
			const query = await col.doc((ctx.query.id as string) || "").get();
			if (!query.exists) return { notFound: true };

			const user = query.data() as User;
			return { props: { user } };
		}
	);
