import { EditableItem } from "components/card/EditableItem";
import { Main } from "components/layout/Main";
import type { Academic } from "entities/Academic";
import type { DefaultResponse } from "entities/DefaultResponse";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { Store } from "react-notifications-component";

interface Props {
	academics: Academic[];
}

const AdminAcademics: NextPage<Props> = ({ academics }) => {
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

	const deleteAcademic = useCallback(
		(id: string) => {
			fetcher(undefined, new URLSearchParams({ id }));
		},
		[fetcher]
	);

	return (
		<>
			<NextSeo title="Administração - Acadêmicos" noindex nofollow />

			<Main title="Acadêmicos">
				<div className="flex flex-col justify-center items-center gap-4">
					<div className="flex justify-between items-center max-w-xl w-full">
						<h1 className="text-2xl font-semibold">Registro</h1>
						<Link href="/admin/academicos/novo">
							<a>
								<MdAdd className="text-3xl cursor-pointer" />
							</a>
						</Link>
					</div>
					<div className="flex flex-col justify-center items-center max-w-xl w-full gap-2">
						{academics?.length ? (
							academics.map(academic => (
								<EditableItem
									key={academic.id}
									title={academic.name}
									editUrl={`/admin/academicos/${academic.metadata.urlId}`}
									deleteAction={() => deleteAcademic(academic.id)}
									loading={loading}
									deleteLabel="Clique duas vezes para deletar o acadêmico permanentemente."
								/>
							))
						) : (
							<p>Não há acadêmicos ainda.</p>
						)}
					</div>
				</div>
			</Main>
		</>
	);
};

export default AdminAcademics;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler(ctx, { col: "academics", autoTry: true }, async col => {
		const query = await col.get();
		const academics: Academic[] = [];

		if (!query.empty) {
			for (const doc of query.docs) {
				const academic = doc.data() as Academic;
				academics.push({ ...academic, bio: {} });
			}
		}

		return { props: { academics } };
	});
