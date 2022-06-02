import { Button } from "@material-tailwind/react";

import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AccountData: NextPage = () => {
	const { data } = useSession();
	if (!data || !data.user) return null;

	return (
		<>
			<Head>
				<title>ASCLA - Sua conta</title>
			</Head>

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

				{data.user.role === "admin" && (
					<Link href="/admin">
						<Button color="orange" className="mt-2">
							Administração
						</Button>
					</Link>
				)}
				<Button color="red" className="mt-3" onClick={() => signOut()}>
					Sair
				</Button>
			</main>
		</>
	);
};

export default AccountData;
