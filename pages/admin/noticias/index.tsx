import { EditableItem } from "components/card/EditableItem";
import { Main } from "components/layout/Main";
import type { BlogPost } from "entities/BlogPost";
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
	news: BlogPost[];
}

const AdminNews: NextPage<Props> = ({ news }) => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>("/api/news/delete", "delete");

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Notícia deletada com sucesso.",
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
				message: `Não foi possível deletar a notícia. ${
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

	const deleteNews = useCallback(
		(id: string) => {
			fetcher(undefined, new URLSearchParams({ id }));
		},
		[fetcher]
	);

	return (
		<>
			<NextSeo title="Administração - Notícias" noindex nofollow />

			<Main title="Notícias">
				<div className="flex flex-col justify-center items-center gap-4">
					<div className="flex justify-between items-center max-w-xl w-full">
						<h1 className="text-2xl font-semibold">Postagens</h1>
						<Link href="/admin/noticias/novo">
							<a>
								<MdAdd className="text-3xl cursor-pointer" />
							</a>
						</Link>
					</div>
					<div className="flex flex-col justify-center items-center max-w-xl w-full gap-2">
						{news?.length ? (
							news.map(post => (
								<EditableItem
									key={post.id}
									title={post.title}
									editUrl={`/admin/noticias/${post.metadata.urlId}`}
									deleteAction={() => deleteNews(post.id)}
									loading={loading}
									deleteLabel="Clique duas vezes para deletar a notícia permanentemente."
								/>
							))
						) : (
							<p>Não há notícias ainda.</p>
						)}
					</div>
				</div>
			</Main>
		</>
	);
};

export default AdminNews;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(ctx, { col: "news", autoTry: true }, async col => {
		const query = await col.get();
		const news: BlogPost[] = [];

		if (!query.empty) {
			for (const doc of query.docs) {
				const post = doc.data() as BlogPost;
				news.push({ ...post, content: {} });
			}
		}

		return { props: { news } };
	});