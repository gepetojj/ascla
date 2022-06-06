import { Button } from "components/input/Button";
import type { BlogPost } from "entities/BlogPost";
import { firestore } from "myFirebase/server";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback } from "react";
import { MdDelete, MdMode, MdAdd } from "react-icons/md";

interface Data {
	posts: BlogPost[];
}

const AdminBlog: NextPage<Data> = ({ posts }) => {
	const deletePost = useCallback((id: string) => {
		fetch(`/api/blog/post/delete?id=${id}`, { method: "DELETE" })
			.then(async res => {
				if (res.ok) {
					alert("Post deletado com sucesso.");
					window.location.reload();
					return;
				}

				const json = await res.json();
				console.error(json);
				alert("Falha.");
			})
			.catch(() => {
				alert("Falha.");
			});
	}, []);

	return (
		<>
			<Head>
				<title>ASCLA - Administração - Blog</title>
			</Head>

			<main className="flex flex-col justify-center items-center h-screen">
				<div className="flex justify-between items-center w-96">
					<h1 className="text-2xl font-bold">Postagens do blog</h1>
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

export const getServerSideProps: GetServerSideProps<Data> = async () => {
	const col = firestore.collection("posts");
	const query = await col.get();
	const posts: BlogPost[] = [];

	if (!query.empty) {
		query.forEach(doc => {
			const post = doc.data() as BlogPost;
			posts.push(post);
		});
	}

	return {
		props: {
			posts,
		},
	};
};
