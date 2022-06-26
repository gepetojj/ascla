import { EditableItem } from "components/card/EditableItem";
import { Main } from "components/layout/Main";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Patron } from "entities/Patron";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { MdAdd } from "react-icons/md";
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
					err?.message ? `Motivo: ${err.message}` : ""
				}`,
				type: "danger",
				container: "bottom-right",
				dismiss: {
					duration: 5000,
					onScreen: true,
				},
			});
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

			<Main title="Patronos">
				<div className="flex flex-col justify-center items-center gap-4">
					<div className="flex justify-between items-center max-w-xl w-full">
						<h1 className="text-2xl font-semibold">Registro</h1>
						<Link href="/admin/patronos/novo" shallow>
							<a>
								<MdAdd className="text-3xl cursor-pointer" />
							</a>
						</Link>
					</div>
					<div className="flex flex-col justify-center items-center max-w-xl w-full gap-2">
						{patrons?.length ? (
							patrons.map(patron => (
								<EditableItem
									key={patron.id}
									title={patron.name}
									editUrl={`/admin/patronos/${patron.metadata.urlId}`}
									deleteAction={() => deletePatron(patron.id)}
									loading={loading}
									deleteLabel="Clique duas vezes para deletar o patrono permanentemente."
								/>
							))
						) : (
							<p>Não há patronos ainda.</p>
						)}
					</div>
				</div>
			</Main>
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
