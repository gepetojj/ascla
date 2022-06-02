import { NextPage } from "next";
import { useSession, signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { ImGoogle } from "react-icons/im";

const Account: NextPage = () => {
	const { push } = useRouter();
	const { data, status } = useSession();

	useEffect(() => {
		if (!data?.user) return;
		push("/conta/dados");
	}, [data, push]);

	return (
		<>
			<Head>
				<title>ASCLA - Faça login</title>
			</Head>

			<main className="flex flex-col justify-center items-center h-screen">
				<div className="max-w-md bg-grey-50 shadow-sm rounded-sm p-4">
					<h2 className="text-3xl font-bold">Faça login</h2>
					<p className="mt-1 italic text-blue-grey-700">
						Com uma conta você pode comentar e classificar postagens do blog!
					</p>
					<div className="flex justify-center items-center w-full mt-4">
						<button
							className="flex justify-center items-center p-2 bg-orange-300 rounded-sm duration-200 hover:brightness-95 active:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed"
							disabled={status === "loading" || status === "authenticated"}
							onClick={() => signIn("google")}
						>
							<ImGoogle className="mr-3" />
							{!!data ? "Já logado" : "Entre com Google"}
						</button>
					</div>
				</div>
			</main>
		</>
	);
};

export default Account;
