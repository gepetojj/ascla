import { CardBlog } from "components/card/Blog";
import { Search } from "components/input/Search";
import { Main } from "components/layout/Main";
import { config } from "config";
import type { Post } from "entities/Post";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
	initialNews: Post<true>[];
}

const News: NextPage<Props> = ({ initialNews }) => {
	const { pathname, query } = useRouter();
	const [news, setNews] = useState<Post<true>[]>(initialNews);
	const [hasMore, setHasMore] = useState(true);

	const loadMorePosts = async () => {
		const url = new URL(`${config.basePath}/api/posts/list`);
		url.searchParams.set("author", "true");
		url.searchParams.set("type", "news");
		url.searchParams.set("page", String(Math.floor(news.length / initialNews.length)));

		fetch(url)
			.then(async res => {
				if (!res.ok) {
					setHasMore(false);
					return;
				}

				const newPosts: { posts: Post<true>[] } = await res.json();
				if (!newPosts.posts || newPosts.posts.length <= 0) {
					setHasMore(false);
					return;
				}

				setNews(news => [...news, ...newPosts.posts]);
				setHasMore(newPosts.posts.length === initialNews.length);
			})
			.catch(() => {
				setHasMore(false);
			});
	};

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
				<ul>
					{!!news && news.length ? (
						<InfiniteScroll
							className="flex flex-col gap-4 max-w-5xl w-full"
							dataLength={news.length}
							next={loadMorePosts}
							hasMore={hasMore}
							loader={
								<span className="text-lg text-center">
									Carregando mais notícias...
								</span>
							}
							endMessage={
								<span className="text-lg text-center">
									Você viu todas as notícias! 🎉
								</span>
							}
						>
							{news.map(post => (
								<CardBlog key={post.id} {...post} type="blog" />
							))}
						</InfiniteScroll>
					) : (
						<span className="text-lg text-center">Ainda não há postagens.</span>
					)}
				</ul>
			</Main>
		</>
	);
};

export default News;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler(ctx, { col: "news", autoTry: true }, async () => {
		let initialNews: Post<true>[] = [];

		const res = await fetch(`${config.basePath}/api/posts/list?author=true&type=news`);
		if (!res.ok) return { props: { initialNews } };

		const data: { posts: Post<true>[] } = await res.json();
		initialNews = data.posts.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
		return { props: { initialNews } };
	});
