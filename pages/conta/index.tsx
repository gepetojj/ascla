import { Button } from "components/input/Button";
import { Image } from "components/view/Image";
import { NextPage } from "next";
import { useSession, signIn } from "next-auth/react";
import { NextSeo } from "next-seo";
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
			<NextSeo title="Faça login" />

			<main className="flex flex-col justify-center items-center h-screen bg-primary-200">
				<div className="max-w-sm mx-6">
					<div className="flex items-center mb-8">
						<div className="flex items-center">
							<Image
								src="logo-ascla.webp"
								alt="Logo da ASCLA"
								layout="fixed"
								width={52}
								height={52}
								priority
							/>
						</div>
						<h1 className="text-2xl font-medium text-black-100 ml-4">ASCLA</h1>
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
							onClick={() => signIn("google")}
							fullWidth
						>
							{status !== "loading" && <ImGoogle className="mr-3" />}
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
