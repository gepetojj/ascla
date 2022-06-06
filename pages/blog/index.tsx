import { CardBlog } from "components/card/Blog";
import { Main } from "components/layout/Main";
import type { BlogPost } from "entities/BlogPost";
import { firestore } from "myFirebase/server";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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

			<Main title="Notícias">
				<div className="flex flex-col gap-4 w-full">
					{posts.length ? (
						posts.map(post => <CardBlog key={post.id} {...post} />)
					) : (
						<span className="text-lg italic">Ainda não há postagens :(</span>
					)}
				</div>
			</Main>
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
