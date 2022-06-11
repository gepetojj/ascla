import { Button } from "components/input/Button";
import type { BlogPost } from "entities/BlogPost";
import type { DefaultResponse } from "entities/DefaultResponse";
import { gSSPHandler } from "helpers/gSSPHandler";
import { useFetcher } from "hooks/useFetcher";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { MdDelete, MdMode, MdAdd } from "react-icons/md";
import { Store } from "react-notifications-component";

interface Props {
	posts: BlogPost[];
}

const AdminBlog: NextPage<Props> = ({ posts }) => {
	const { fetcher, events, loading } = useFetcher<DefaultResponse>(
		"/api/blog/post/delete",
		"delete"
	);

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

	const deletePost = useCallback(
		(id: string) => {
			fetcher(undefined, new URLSearchParams({ id }));
		},
		[fetcher]
	);

	return (
		<>
			<NextSeo title="Administração - Notícias" noindex nofollow />

			<main className="flex flex-col justify-center items-center h-screen">
				<div className="flex justify-between items-center w-96">
					<h1 className="text-2xl font-bold">Notícias</h1>
					<Link href="/admin/blog/novo">
						<a>
							<MdAdd className="text-3xl cursor-pointer" />
						</a>
					</Link>
				</div>
				<div className="flex flex-col justify-center items-center mt-4">
					{posts?.length ? (
						posts.map(post => (
							<div
								key={post.id}
								className="flex items-center bg-orange-300 px-2 py-1 mb-2 rounded-sm"
							>
								<span className="w-80 max-w-xs truncate pr-3">{post.title}</span>
								<div className="flex items-center">
									<Link href={`/admin/blog/${post.metadata.urlId}`}>
										<a>
											<MdMode className="text-xl cursor-pointer mr-2" />
										</a>
									</Link>
									<Button
										title="Clique duas vezes para deletar o post permanentemente."
										onDoubleClick={() => deletePost(post.id)}
										loading={loading}
									>
										<MdDelete className="text-xl" />
									</Button>
								</div>
							</div>
						))
					) : (
						<p>Não há postagens ainda.</p>
					)}
				</div>
			</main>
		</>
	);
};

export default AdminBlog;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler<Props>(ctx, { col: "posts", autoTry: true }, async col => {
		const query = await col.get();
		const posts: BlogPost[] = [];

		if (!query.empty) {
			for (const doc of query.docs) {
				const post = doc.data() as BlogPost;
				posts.push({ ...post, content: {} });
			}
		}

		return { props: { posts } };
	});
