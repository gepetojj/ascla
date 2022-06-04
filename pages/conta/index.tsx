import { Button } from "@material-tailwind/react";

import { NextPage } from "next";
import { useSession, signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { ImGoogle } from "react-icons/im";

const Account: NextPage = () => {
	const { push } = useRouter();
	const { data, status } = useSession();

	useEffect(() => {
		if (!data?.user) return;
		push("/conta/dados", undefined, { shallow: true });
	}, [data, push]);

	return (
		<>
			<Head>
				<title>ASCLA - Faça login</title>
			</Head>

			<main className="flex flex-col justify-center items-center h-screen bg-primary-300">
				<div className="max-w-sm">
					<div className="flex items-center mb-8">
						<div className="flex items-center">
							<Image
								src="/logo-ascla.webp"
								alt="Logo da ASCLA"
								layout="fixed"
								width={52}
								height={52}
								priority
							/>
						</div>
						<h1 className="text-2xl font-medium text-secondary-800 ml-4">ASCLA</h1>
					</div>
					<h2 className="text-2xl font-bold">Faça login</h2>
					<p className="mt-1 text-black-200">
						Uma vez logado, você será capaz de comentar e classificar postagens no blog.
					</p>
					<div className="flex justify-center items-center w-full mt-6">
						<Button
							className="flex justify-center items-center font-body font-medium text-black-main bg-primary-main rounded-sm shadow-none duration-200 hover:shadow-none hover:brightness-95 disabled:brightness-75 disabled:cursor-not-allowed"
							disabled={status === "loading" || status === "authenticated"}
							onClick={() => signIn("google")}
							fullWidth
						>
							<ImGoogle className="mr-3" />
							{!!data ? "Já logado" : "Entre com Google"}
						</Button>
					</div>
					<div className="flex justify-center items-center w-full mt-8">
						<Link href="/" shallow>
							<a className="text-secondary-800 text-sm hover:underline">
								Voltar para o site
							</a>
						</Link>
					</div>
				</div>
			</main>
		</>
	);
};

export default Account;
