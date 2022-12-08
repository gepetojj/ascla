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
	initialPosts: Post<true>[];
}

const Blog: NextPage<Props> = ({ initialPosts }) => {
	const { pathname, query } = useRouter();
	const [posts, setPosts] = useState<Post<true>[]>(initialPosts);
	const [hasMore, setHasMore] = useState(true);

	const loadMorePosts = async () => {
		const url = new URL(`${config.basePath}/api/posts/list`);
		url.searchParams.set("author", "true");
		url.searchParams.set("type", "blogPosts");
		url.searchParams.set("page", String(Math.floor(posts.length / initialPosts.length)));

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

				setPosts(posts => [...posts, ...newPosts.posts]);
				setHasMore(newPosts.posts.length === initialPosts.length);
			})
			.catch(() => {
				setHasMore(false);
			});
	};

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
				<ul>
					{!!posts && posts.length ? (
						<InfiniteScroll
							className="flex flex-col gap-4 max-w-5xl w-full"
							dataLength={posts.length}
							next={loadMorePosts}
							hasMore={hasMore}
							loader={
								<span className="text-lg text-center">
									Carregando mais postagens...
								</span>
							}
							endMessage={
								<span className="text-lg text-center">
									Você viu todas as postagens! 🎉
								</span>
							}
						>
							{posts.map(post => (
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

export default Blog;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler(ctx, { col: "blogPosts", autoTry: true }, async () => {
		let initialPosts: Post<true>[] = [];

		const res = await fetch(`${config.basePath}/api/posts/list?author=true&type=blogPosts`);
		if (!res.ok) return { props: { initialPosts } };

		const data: { posts: Post<true>[] } = await res.json();
		initialPosts = data.posts.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
		return { props: { initialPosts } };
	});
