import { EditableItem } from "components/card/EditableItem";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { DefaultResponse } from "entities/DefaultResponse";
import type { Post } from "entities/Post";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { Store } from "react-notifications-component";

interface Props {
	posts: Post[];
}

const AdminBlog: NextPage<Props> = ({ posts }) => {
	const { data } = useSession();
	const { fetcher, events, loading } = useFetcher<DefaultResponse>("/api/posts/delete", "delete");

	useEffect(() => {
		const onSuccess = () => {
			Store.addNotification({
				title: "Sucesso",
				message: "Postagem deletada com sucesso.",
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
				message: `Não foi possível deletar a postagem. ${
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

	const deleteNews = useCallback(
		(id: string) => {
			fetcher(undefined, new URLSearchParams({ id, type: "blogPosts" }));
		},
		[fetcher]
	);

	return (
		<>
			<NextSeo title="Administração - Blog" noindex nofollow />

			<Main title="Blog">
				<div className="flex flex-col justify-center items-center gap-4">
					<div className="flex justify-between items-center max-w-xl w-full">
						<h1 className="text-2xl font-semibold">Postagens</h1>
						<Link href="/admin/blog/novo">
							<a>
								<MdAdd className="text-3xl cursor-pointer" />
							</a>
						</Link>
					</div>
					<div className="flex flex-col justify-center items-center max-w-xl w-full gap-2">
						{!!posts &&
						posts.filter(post =>
							data?.user?.role === "academic"
								? post.metadata.authorId === data?.user?.id
								: true
						).length ? (
							posts
								.filter(post =>
									data?.user?.role === "academic"
										? post.metadata.authorId === data?.user?.id
										: true
								)
								.map(post => (
									<EditableItem
										key={post.id}
										title={post.title}
										editUrl={`/admin/blog/${post.metadata.urlId}`}
										deleteAction={() => deleteNews(post.id)}
										loading={loading}
										deleteLabel="Clique duas vezes para deletar a postagem permanentemente."
									/>
								))
						) : (
							<p>
								{data?.user?.role === "academic"
									? "Você não fez postagens ainda."
									: "Não há postagens ainda."}
							</p>
						)}
					</div>
				</div>
			</Main>
		</>
	);
};

export default AdminBlog;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(ctx, { col: "blogPosts", autoTry: true }, async () => {
		const res = await fetch(`${config.basePath}/api/posts/list?type=blogPosts`);
		if (!res.ok) return { props: { posts: [] } };

		const data: { posts: Post[] } = await res.json();
		const posts: Post[] = data.posts;

		return { props: { posts } };
	});
