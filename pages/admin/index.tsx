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
				<h1 className="text-2xl font-bold">Página de Administração</h1>
				<div className="flex flex-col justify-center items-center mt-4">
					<Link href="/admin/destaques">
						<a className="px-2 py-1 bg-orange-400 rounded-sm">Destaques</a>
					</Link>
					<Link href="/admin/blog">
						<a className="px-2 py-1 bg-orange-400 rounded-sm">Blog</a>
					</Link>
					<Link href="/admin/usuarios">
						<a className="mt-2 px-2 py-1 bg-orange-400 rounded-sm">Usuários</a>
					</Link>
					<Link href="/admin/patronos">
						<a className="mt-2 px-2 py-1 bg-orange-400 rounded-sm">Patronos</a>
					</Link>
					<Link href="/admin/academicos">
						<a className="mt-2 px-2 py-1 bg-orange-400 rounded-sm">Acadêmicos</a>
					</Link>
					<Link href="/admin/socios">
						<a className="mt-2 px-2 py-1 bg-orange-400 rounded-sm">Sócios</a>
					</Link>
				</div>
			</main>
		</>
	);
};

export default Admin;
