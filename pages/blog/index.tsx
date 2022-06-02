import { Card, CardBody, CardFooter } from "@material-tailwind/react";

import type { BlogPost } from "entities/BlogPost";
import { firestore } from "myFirebase/server";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

interface Props {
	posts: BlogPost[];
}

const Blog: NextPage<Props> = ({ posts }) => {
	return (
		<>
			<Head>
				<title>ASCLA - Blog</title>
			</Head>

			<main className="flex flex-col h-full p-6">
				<h1 className="text-2xl font-bold">Postagens do Blog</h1>
				<div className="flex flex-wrap w-full mt-4">
					{posts.length ? (
						posts.map(post => (
							<Card key={post.id} className="w-96 bg-grey-50 m-2">
								<CardBody className="flex flex-col">
									<span className="text-xl font-bold break-words">
										{post.title}
									</span>
									<span className="text-sm text-grey-800 italic mt-2 break-words">
										{post.description}
									</span>
								</CardBody>
								<CardFooter divider className="flex justify-between items-center">
									<span className="text-xs">
										{new Date(post.metadata.createdAt).toLocaleDateString()}
									</span>
									<Link href={`/blog/${post.metadata.urlId}`}>
										<a className="text-xs cursor-pointer hover:underline">
											Ler mais
										</a>
									</Link>
								</CardFooter>
							</Card>
						))
					) : (
						<span className="text-lg italic">Ainda não há postagens :(</span>
					)}
				</div>
			</main>
		</>
	);
};

export default Blog;

export const getServerSideProps: GetServerSideProps<Props> = async ({ res }) => {
	const col = firestore.collection("posts");

	try {
		const query = await col.get();
		const posts: BlogPost[] = [];
		if (query.empty || !query.docs.length) return { props: { posts } };

		// Remove o conteúdo, já que não será usado agora e pode aumentar muito o tamanho da transferência
		query.forEach(doc => posts.push({ ...doc.data(), content: {} } as BlogPost));
		return { props: { posts } };
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		return { props: { posts: [] } };
	}
};
