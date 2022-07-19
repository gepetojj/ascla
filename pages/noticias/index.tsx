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
	news: BlogPost<true>[];
}

const News: NextPage<Props> = ({ news }) => {
	const { pathname } = useRouter();

	return (
		<>
			<NextSeo
				title="Notícias"
				description="Fique por dentro das notícias da academia!"
				canonical={`${config.basePath}${pathname}`}
			/>

			<Main title="Notícias" className="flex flex-col justify-center items-center p-6 pb-10">
				<div className="flex flex-col gap-4 max-w-5xl w-full">
					{!!news && news.length ? (
						news.map(post => <CardBlog key={post.id} {...post} type="noticias" />)
					) : (
						<span className="text-lg text-center">Ainda não há notícias.</span>
					)}
				</div>
			</Main>
		</>
	);
};

export default News;

export const getServerSideProps: GetServerSideProps<Props> = ctx =>
	gSSPHandler(ctx, { col: "news", autoTry: true }, async () => {
		let news: BlogPost<true>[] = [];

		const res = await fetch(`${config.basePath}/api/news/list?author=true`);
		if (res.ok) {
			const data = (await res.json()) as { news: BlogPost<true>[] };
			news = data.news.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
		}

		return { props: { news } };
	});
