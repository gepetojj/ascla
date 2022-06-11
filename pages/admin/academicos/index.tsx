import { Button } from "components/input/Button";
import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { useFetcher } from "hooks/useFetcher";
import { Collections } from "myFirebase/enums";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { MdDelete, MdMode, MdAdd } from "react-icons/md";
import { Store } from "react-notifications-component";

interface Data {
	academics: Academic[];
}

const AdminAcademics: NextPage<Data> = ({ academics }) => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/academics/delete",
		"delete"
	);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Acadêmico deletado com sucesso.",
				type: "success",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
			window.location.reload();
		};

		const onError = (err?: DefaultResponse) => {
			Store.addNotification({
				title: "Erro",
				message: `Não foi possível deletar o acadêmico. ${
					err?.message && `Motivo: ${err.message}`
				}`,
				type: "danger",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
			console.error(err);
		};

		events.on("success", onSuccess);
		events.on("error", onError);

		return () => {
			events.removeListener("success", onSuccess);
			events.removeListener("error", onError);
		};
	}, [events]);

	const deleteAcademic = useCallback(
		(id: string) => {
			fetcher(undefined, new URLSearchParams({ id }));
		},
		[fetcher]
	);

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

									<Button
										title="Clique duas vezes para deletar o acadêmico permanentemente."
										onDoubleClick={() => deleteAcademic(academic.id)}
										loading={loading}
									>
										<MdDelete className="text-xl" />
									</Button>
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
	const col = Collections.academics;
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
