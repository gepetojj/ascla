import { Button } from "components/input/Button";
import { Main } from "components/layout/Main";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AccountData: NextPage = () => {
	const { data } = useSession();
	if (!data || !data.user) return null;

	return (
		<>
			<NextSeo title="Sua conta" />

			<Main title="Sua conta">
				<div className="flex justify-center items-center gap-6">
					<div>
						<Image
							src={String(data.user.image)}
							alt="Avatar do usuário"
							width={62}
							height={62}
							className="rounded-full"
						/>
					</div>
					<div className="flex flex-col">
						<span>Nome: {data.user.name}</span>
						<span>Email: {data.user.email}</span>
						<span>Cargo: {data.user.role}</span>
					</div>
				</div>

				<div className="flex flex-col gap-2 mt-6">
					{data.user.role !== "common" && (
						<Link href="/admin" passHref shallow>
							<Button className="bg-primary-main" fullWidth>
								Administração
							</Button>
						</Link>
					)}
					<Button
						className="bg-red-500 text-cream-100"
						onClick={() => signOut({ callbackUrl: "/conta" })}
						fullWidth
					>
						Sair
					</Button>
				</div>
			</Main>
		</>
	);
};

export default AccountData;
