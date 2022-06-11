import { Button } from "components/input/Button";
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

			<main className="flex flex-col">
				<div className="flex justify-between items-center mx-6">
					<div className="flex flex-col">
						<span>Nome: {data.user.name}</span>
						<span>Email: {data.user.email}</span>
						<span>Cargo: {data.user.role}</span>
					</div>
					<Image
						src={String(data.user.image)}
						alt="Avatar do usuário"
						width={62}
						height={62}
					/>
				</div>

				<div className="flex flex-col gap-2 mx-6 mt-4">
					{data.user.role === "admin" && (
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
			</main>
		</>
	);
};

export default AccountData;
