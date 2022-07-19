import { CardBlog } from "components/card/Blog";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { BlogPost } from "entities/BlogPost";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

interface Props {
	posts: BlogPost<true>[];
}

const Blog: NextPage<Props> = ({ posts }) => {
	const { pathname } = useRouter();

	return (
		<>
			<NextSeo
				title="Blog"
				description={`Veja as postagens feitas pelos acadêmicos da ${config.shortName}.`}
				canonical={`${config.basePath}${pathname}`}
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
	gSSPHandler(ctx, { col: "blogPosts", autoTry: true }, async () => {
		let posts: BlogPost<true>[] = [];

		const res = await fetch(`${config.basePath}/api/blog/list?author=true`);
		if (res.ok) {
			const data = (await res.json()) as { posts: BlogPost<true>[] };
			posts = data.posts.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
		}

		return { props: { posts } };
	});
