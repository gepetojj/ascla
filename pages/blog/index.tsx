import { CardBlog } from "components/card/Blog";
import { Main } from "components/layout/Main";
import type { BlogPost } from "entities/BlogPost";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

interface Props {
	posts: BlogPost[];
}

const Blog: NextPage<Props> = ({ posts }) => {
	return (
		<>
			<NextSeo
				title="Blog"
				description="Veja as postagens feitas pelos acadêmicos da ASCLA."
			/>

			<Main title="Blog" className="flex flex-col justify-center items-center p-6 pb-10">
				<div className="flex flex-col gap-4 max-w-5xl w-full">
					{!!posts && posts.length ? (
						posts.map(post => <CardBlog key={post.id} {...post} type="blog" />)
					) : (
						<span className="text-lg text-center">Ainda não há postagens.</span>
					)}
				</div>
			</Main>
		</>
	);
};

export default Blog;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler(ctx, { col: "blogPosts", autoTry: true }, async col => {
		const query = await col.get();
		const posts: BlogPost[] = [];

		if (!query.empty) {
			for (const post of query.docs) posts.push({ ...post.data(), content: {} } as BlogPost);
		}

		return { props: { posts } };
	});
