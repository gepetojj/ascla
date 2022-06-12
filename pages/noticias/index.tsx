import { CardBlog } from "components/card/Blog";
import { Main } from "components/layout/Main";
import type { BlogPost } from "entities/BlogPost";
import { gSSPHandler } from "helpers/gSSPHandler";
import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import React from "react";

interface Props {
	news: BlogPost[];
}

const News: NextPage<Props> = ({ news }) => {
	return (
		<>
			<NextSeo title="Notícias" />

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
	gSSPHandler(ctx, { col: "news", autoTry: true }, async col => {
		const query = await col.get();
		const news: BlogPost[] = [];

		if (!query.empty) {
			for (const post of query.docs) news.push({ ...post.data(), content: {} } as BlogPost);
		}

		return { props: { news } };
	});
