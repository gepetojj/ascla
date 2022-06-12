import { Button } from "components/input/Button";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React from "react";

const Admin: NextPage = () => {
	const { data } = useSession();

	return (
		<>
			<NextSeo title="Administração" />

			<main className="flex flex-col justify-center items-center h-screen">
				<h1 className="text-2xl text-center font-bold">Página de Administração</h1>
				<div className="flex flex-col flex-wrap justify-center items-center mt-4 gap-2">
					<Link href="/admin/blog" passHref>
						<Button className="bg-primary-main">Blog</Button>
					</Link>
					{data?.user?.role === "admin" && (
						<>
							<Link href="/admin/destaques" passHref>
								<Button className="bg-primary-main">Destaques</Button>
							</Link>
							<Link href="/admin/noticias" passHref>
								<Button className="bg-primary-main">Notícias</Button>
							</Link>
							<Link href="/admin/usuarios" passHref>
								<Button className="bg-primary-main">Usuários</Button>
							</Link>
							<Link href="/admin/patronos" passHref>
								<Button className="bg-primary-main">Patronos</Button>
							</Link>
							<Link href="/admin/academicos" passHref>
								<Button className="bg-primary-main">Acadêmicos</Button>
							</Link>
							<Link href="/admin/socios" passHref>
								<Button className="bg-primary-main">Sócios</Button>
							</Link>
						</>
					)}
				</div>
			</main>
		</>
	);
};

export default Admin;
