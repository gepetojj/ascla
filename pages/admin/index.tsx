import { Button } from "components/input/Button";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const Admin: NextPage = () => {
	return (
		<>
			<Head>
				<title>ASCLA - Administração</title>
			</Head>

			<main className="flex flex-col justify-center items-center h-screen">
				<h1 className="text-2xl text-center font-bold">Página de Administração</h1>
				<div className="flex flex-wrap justify-center items-center mt-4 gap-2">
					<Link href="/admin/destaques" passHref>
						<Button className="bg-orange-400">Destaques</Button>
					</Link>
					<Link href="/admin/blog" passHref>
						<Button className="bg-orange-400">Notícias</Button>
					</Link>
					<Link href="/admin/usuarios" passHref>
						<Button className="bg-orange-400">Usuários</Button>
					</Link>
					<Link href="/admin/patronos" passHref>
						<Button className="bg-orange-400">Patronos</Button>
					</Link>
					<Link href="/admin/academicos" passHref>
						<Button className="bg-orange-400">Acadêmicos</Button>
					</Link>
					<Link href="/admin/socios" passHref>
						<Button className="bg-orange-400">Sócios</Button>
					</Link>
				</div>
			</main>
		</>
	);
};

export default Admin;
