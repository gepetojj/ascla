import { Button } from "components/input/Button";
import type { Patron } from "entities/Patron";
import { firestore } from "myFirebase/server";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback } from "react";
import { MdDelete, MdMode, MdAdd } from "react-icons/md";

interface Data {
	patrons: Patron[];
}

const AdminPatrons: NextPage<Data> = ({ patrons }) => {
	const deletePatron = useCallback((id: string) => {
		fetch(`/api/patrons/delete?id=${id}`, { method: "DELETE" })
			.then(async res => {
				if (res.ok) {
					alert("Patrono deletado com sucesso.");
					window.location.reload();
					return;
				}

				const data = await res.json();
				console.error(data);
				alert("Falha.");
			})
			.catch(() => {
				alert("Falha.");
			});
	}, []);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Patronos</title>
			</Head>

			<main className="flex flex-col justify-center items-center h-screen">
				<div className="flex justify-between items-center w-96">
					<h1 className="text-2xl font-bold">Patronos</h1>
					<Link href="/admin/patronos/novo" shallow>
						<a>
							<MdAdd className="text-3xl cursor-pointer" />
						</a>
					</Link>
				</div>
				<div className="flex flex-col justify-center items-center mt-4">
					{patrons?.length ? (
						patrons.map(patron => (
							<div
								key={patron.id}
								className="flex items-center bg-orange-300 px-2 py-1 mb-2 rounded-sm"
							>
								<span className="w-80 max-w-xs truncate pr-3">{patron.name}</span>
								<div className="flex items-center gap-2">
									<Link href={`/admin/patronos/${patron.metadata.urlId}`} shallow>
										<a>
											<MdMode className="text-xl cursor-pointer" />
										</a>
									</Link>

									<Button
										title="Clique duas vezes para deletar o patrono permanentemente."
										onDoubleClick={() => deletePatron(patron.id)}
									>
										<MdDelete className="text-xl" />
									</Button>
								</div>
							</div>
						))
					) : (
						<p>Não há patronos ainda.</p>
					)}
				</div>
			</main>
		</>
	);
};

export default AdminPatrons;

export const getServerSideProps: GetServerSideProps<Data> = async () => {
	const col = firestore.collection("patrons");
	const query = await col.get();
	const patrons: Patron[] = [];

	if (!query.empty) {
		query.forEach(doc => {
			const patron = doc.data() as Patron;
			patrons.push(patron);
		});
	}

	return {
		props: {
			patrons,
		},
	};
};
