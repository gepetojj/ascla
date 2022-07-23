import { CardBlog } from "components/card/Blog";
import { Search } from "components/input/Search";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { Post } from "entities/Post";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";

interface Props {
	posts: Post<true>[];
}

const Blog: NextPage<Props> = ({ posts }) => {
	const { pathname, query } = useRouter();

	return (
		<>
			<NextSeo
				title="Blog"
				description={`Veja as postagens feitas pelos acadêmicos da ${config.shortName}.`}
				canonical={`${config.basePath}${pathname}`}
			/>

			<Main title="Blog" className="flex flex-col justify-center items-center p-6 pb-10">
				<Search
					data={posts}
					options={{
						keys: ["title", "description", "metadata.author.name"],
						threshold: 0.45,
					}}
					matchComponent={match => {
						const item = match.item as Post;
						return <CardBlog key={item.id} {...item} type="blog" />;
					}}
					initialSearch={typeof query.search === "string" ? query.search : undefined}
					placeholder="Procure postagens:"
					disabled={posts?.length <= 0}
					width="max-w-5xl"
				/>
				<ul className="flex flex-col gap-4 max-w-5xl w-full">
					{!!posts && posts.length ? (
						posts.map(post => <CardBlog key={post.id} {...post} type="blog" />)
					) : (
						<span className="text-lg text-center">Ainda não há postagens.</span>
					)}
				</ul>
			</Main>
		</>
	);
};

export default Blog;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler(ctx, { col: "blogPosts", autoTry: true }, async () => {
		let posts: Post<true>[] = [];

		const res = await fetch(`${config.basePath}/api/posts/list?author=true&type=blogPosts`);
		if (!res.ok) return { props: { posts } };

		const data: { posts: Post<true>[] } = await res.json();
		posts = data.posts.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
		return { props: { posts } };
	});
