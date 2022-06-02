import { Button, Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";

import type { Academic } from "entities/Academic";
import { firestore } from "myFirebase/server";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback } from "react";
import { MdDelete, MdMode, MdAdd } from "react-icons/md";

interface Data {
	academics: Academic[];
}

const AdminAcademics: NextPage<Data> = ({ academics }) => {
	const deleteAcademic = useCallback((id: string) => {
		fetch(`/api/academics/delete?id=${id}`, { method: "DELETE" })
			.then(async res => {
				if (res.ok) {
					alert("Acadêmico deletado com sucesso.");
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
				<title>ASCLA - Administração - Acadêmicos</title>
			</Head>

			<main className="flex flex-col justify-center items-center h-screen">
				<div className="flex justify-between items-center w-96">
					<h1 className="text-2xl font-bold">Acadêmicos</h1>
					<Link href="/admin/academicos/novo">
						<a>
							<MdAdd className="text-3xl cursor-pointer" />
						</a>
					</Link>
				</div>
				<div className="flex flex-col justify-center items-center mt-4">
					{academics?.length ? (
						academics.map(academic => (
							<div
								key={academic.id}
								className="flex items-center bg-orange-300 px-2 py-1 mb-2 rounded-sm"
							>
								<span className="w-80 max-w-xs truncate pr-3">{academic.name}</span>
								<div className="flex items-center">
									<Link href={`/admin/academicos/${academic.metadata.urlId}`}>
										<a>
											<MdMode className="text-xl cursor-pointer mr-2" />
										</a>
									</Link>
									<Popover>
										<PopoverHandler>
											<button>
												<MdDelete className="text-xl" />
											</button>
										</PopoverHandler>
										<PopoverContent className="flex flex-col max-w-sm">
											<span className="mb-3">
												Tem certeza que deseja deletar este acadêmico? Não
												será possível recuperá-lo após isso.
											</span>
											<Button
												color="red"
												onClick={() => deleteAcademic(academic.id)}
											>
												Confirmar
											</Button>
										</PopoverContent>
									</Popover>
								</div>
							</div>
						))
					) : (
						<p>Não há acadêmicos ainda.</p>
					)}
				</div>
			</main>
		</>
	);
};

export default AdminAcademics;

export const getServerSideProps: GetServerSideProps<Data> = async () => {
	const col = firestore.collection("academics");
	const query = await col.get();
	const academics: Academic[] = [];

	if (!query.empty) {
		query.forEach(doc => {
			const academic = doc.data() as Academic;
			academics.push(academic);
		});
	}

	return {
		props: {
			academics,
		},
	};
};
