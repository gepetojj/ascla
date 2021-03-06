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
	news: Post<true>[];
}

const News: NextPage<Props> = ({ news }) => {
	const { pathname, query } = useRouter();

	return (
		<>
			<NextSeo
				title="Notícias"
				description="Fique por dentro das notícias da academia!"
				canonical={`${config.basePath}${pathname}`}
			/>

			<Main title="Notícias" className="flex flex-col justify-center items-center p-6 pb-10">
				<Search
					data={news}
					options={{
						keys: ["title", "description", "metadata.author.name"],
						threshold: 0.45,
					}}
					matchComponent={match => {
						const item = match.item as Post;
						return <CardBlog key={item.id} {...item} type="noticias" />;
					}}
					initialSearch={typeof query.search === "string" ? query.search : undefined}
					placeholder="Procure notícias:"
					disabled={news?.length <= 0}
					width="max-w-5xl"
				/>
				<ul className="flex flex-col gap-4 max-w-5xl w-full">
					{!!news && news.length ? (
						news.map(post => <CardBlog key={post.id} {...post} type="noticias" />)
					) : (
						<span className="text-lg text-center">Ainda não há notícias.</span>
					)}
				</ul>
			</Main>
		</>
	);
};

export default News;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler(ctx, { col: "news", autoTry: true }, async () => {
		let news: Post<true>[] = [];

		const res = await fetch(`${config.basePath}/api/posts/list?author=true&type=news`);
		if (!res.ok) return { props: { news } };

		const data: { posts: Post<true>[] } = await res.json();
		news = data.posts.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
		return { props: { news } };
	});
