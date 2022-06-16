import { Button } from "components/input/Button";
import { TextInput } from "components/input/TextInput";
import { Main } from "components/layout/Main";
import type { DefaultResponse } from "entities/DefaultResponse";
import { useFetcher } from "hooks/useFetcher";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Store } from "react-notifications-component";

const AccountData: NextPage = () => {
	const { data } = useSession();
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/users/self-update",
		"put"
	);

	const [name, setName] = useState("Seu nome");
	const [avatarUrl, setAvatarUrl] = useState("");

	const changeUserData = useCallback(() => {
		if (!name && !avatarUrl) {
			Store.addNotification({
				title: "Erro",
				message: "Preencha pelo menos um campo.",
				type: "danger",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
			return;
		}

		const data: { name?: string; avatarUrl?: string } = {};
		if (name && typeof name === "string") data.name = name;
		if (avatarUrl && typeof avatarUrl === "string") data.avatarUrl = avatarUrl;

		fetcher(data);
	}, [fetcher, name, avatarUrl]);

	useEffect(() => {
		setName(String(data?.user?.name || ""));
		setAvatarUrl(String(data?.user?.image || ""));
	}, [data?.user?.name, data?.user?.image]);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message:
					"Dados atualizados com sucesso, faça login novamente para atualizar na interface.",
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
				message: `Não foi possível editar os dados. ${
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

	if (!data || !data.user) return null;

	return (
		<>
			<NextSeo title="Sua conta" />

			<Main title="Sua conta">
				<div className="flex flex-col justify-center gap-10 md:flex-row md:gap-32">
					<div className="flex flex-col items-center gap-4">
						<div>
							<Image
								src={avatarUrl || "/usuario-padrao.webp"}
								alt="Avatar do usuário"
								width={86}
								height={86}
								className="rounded-full"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Button
								title="Altera o avatar do seu usuário"
								className="bg-secondary-800 text-cream-100 py-1.5"
								loading={loading}
								fullWidth
							>
								Alterar imagem
							</Button>
							<Button
								title="Encerrar conexão com sua conta"
								className="bg-red-500 text-cream-100 py-1.5"
								onClick={() => signOut({ callbackUrl: "/conta" })}
								fullWidth
							>
								Sair
							</Button>
						</div>
					</div>

					<div className="flex flex-col w-full gap-3 md:max-w-lg">
						<form
							className="flex flex-col items-end w-full gap-2 sm:justify-between sm:flex-row sm:items-center"
							onSubmit={event => {
								event.preventDefault();
								changeUserData();
							}}
						>
							<TextInput
								id="name"
								label="Seu nome:"
								className="w-full sm:w-80"
								value={name}
								onChange={event => setName(event.target.value)}
							/>
							<Button
								title="Altera seu nome para outro escolhido"
								className="bg-secondary-800 text-cream-100 py-1.5"
								loading={loading}
								type="submit"
							>
								Alterar nome
							</Button>
						</form>
						<div className="flex flex-col w-full gap-2 sm:justify-between sm:flex-row sm:items-center">
							<TextInput
								id="name"
								label="Seu email:"
								className="w-full sm:w-80"
								value={String(data.user.email)}
								readOnly
							/>
						</div>
						{data.user.role !== "common" && (
							<div className="flex flex-col w-full gap-1 mt-2">
								<h3>
									Você é um(a){" "}
									<strong>
										{data.user.role === "academic"
											? "acadêmico(a)."
											: "administrador(a)."}
									</strong>
								</h3>
								<Link href="/admin" passHref shallow>
									<Button
										title="Vai para a página de administração"
										className="bg-primary-main py-1.5 w-full sm:w-80"
										fullWidth
									>
										Administração
									</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</Main>
		</>
	);
};

export default AccountData;
