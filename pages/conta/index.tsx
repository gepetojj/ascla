import { Button } from "components/input/Button";
import { Image } from "components/view/Image";
import { config } from "config";
import { GetServerSideProps, NextPage } from "next";
import { useSession, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { ImGoogle } from "react-icons/im";

const Account: NextPage = () => {
	const { push, pathname, query } = useRouter();
	const { data, status } = useSession();

	useEffect(() => {
		if (!data?.user) return;
		push("/conta/dados");
	}, [data, push]);

	const signInWithGoogle = useCallback(() => {
		const callback = new URL("/conta/dados", config.basePath);
		if (query.convite && typeof query.convite === "string") {
			callback.searchParams.set("convite", query.convite);
		}

		signIn("google", { callbackUrl: callback.toString() });
	}, [query]);

	return (
		<>
			<NextSeo
				title="Faça login"
				description="Faça login com uma conta Google para acessar funções especiais!"
				canonical={`${config.basePath}${pathname}`}
			/>

			<main className="flex flex-col justify-center items-center h-screen bg-primary-200">
				<div className="max-w-sm mx-6">
					<div className="flex items-center mb-8">
						<div className="flex items-center">
							<Image
								src="logo-ascla.webp"
								alt={`Logo da ${config.shortName}`}
								layout="fixed"
								width={52}
								height={52}
								priority
							/>
						</div>
						<h1 className="text-2xl font-medium text-black-100 ml-4">
							{config.shortName}
						</h1>
					</div>
					<h2 className="text-2xl font-bold">Faça login</h2>
					<p className="mt-1 text-black-200">
						Uma vez logado, você será capaz de comentar e classificar postagens no blog.
					</p>
					<div className="flex justify-center items-center w-full mt-6">
						<Button
							className="bg-primary-main"
							disabled={status === "authenticated"}
							loading={status === "loading"}
							onClick={signInWithGoogle}
							fullWidth
						>
							{status !== "loading" && <ImGoogle className="mr-3" />}
							{data ? "Já logado" : "Entre com Google"}
						</Button>
					</div>
					<div className="flex justify-center items-center w-full mt-8">
						<Link href="/">
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

// Solução temporária para erro em deploy de páginas estáticas na netlify
export const getServerSideProps: GetServerSideProps = async () => {
	return { props: {} };
};
