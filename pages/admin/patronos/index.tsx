import { Button } from "components/input/Button";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { MdDelete, MdMode, MdAdd } from "react-icons/md";
import { Store } from "react-notifications-component";

interface Props {
	patrons: Patron[];
}

const AdminPatrons: NextPage<Props> = ({ patrons }) => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/patrons/delete",
		"delete"
	);

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Patrono deletado com sucesso.",
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
				message: `Não foi possível deletar o patrono. ${
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

	const deletePatron = useCallback(
		(id: string) => {
			fetcher(undefined, new URLSearchParams({ id }));
		},
		[fetcher]
	);

	return (
		<>
			<NextSeo title="Administração - Patronos" noindex nofollow />

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
										loading={loading}
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

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(ctx, { col: "patrons", autoTry: true }, async col => {
		const query = await col.get();
		const patrons: Patron[] = [];

		if (!query.empty) {
			for (const doc of query.docs) {
				const patron = doc.data() as Patron;
				patrons.push({ ...patron, bio: {} });
			}
		}

		return { props: { patrons } };
	});
