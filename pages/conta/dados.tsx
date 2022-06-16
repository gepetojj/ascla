import { Button } from "components/input/Button";
import { TextInput } from "components/input/TextInput";
import { Main } from "components/layout/Main";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const AccountData: NextPage = () => {
	const { data } = useSession();
	const [name, setName] = useState("Seu nome");

	useEffect(() => {
		setName(String(data?.user?.name));
	}, [data?.user?.name]);

	if (!data || !data.user) return null;

	return (
		<>
			<NextSeo title="Sua conta" />

			<Main title="Sua conta">
				<div className="flex flex-col justify-center gap-10 md:flex-row md:gap-32">
					<div className="flex flex-col items-center gap-4">
						<div>
							<Image
								src={String(data.user.image) || "/usuario-padrao.webp"}
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
						<div className="flex flex-col items-end w-full gap-2 sm:justify-between sm:flex-row sm:items-center">
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
							>
								Alterar nome
							</Button>
						</div>
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
